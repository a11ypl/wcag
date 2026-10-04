// Jedna struktura treści raportu dla wszystkich formatów.
// Renderery HTML, Markdown i DOCX tylko zapisują te bloki w swojej składni,
// więc każdy format ma tę samą treść, kolejność i hierarchię nagłówków.
//
// Bloki:
//   heading  { level 2–5, text, id }
//   para     { runs }                 runs: [{ text, href? | anchor?, bold? }]  anchor = link wewnętrzny
//   list     { ordered, items: runs[] }
//   table    { caption, headers, rows: cells[][], rowHeaders, rowIds? }   cell: string | runs
//   fields   { label, rows: [label, runs][] }  — pary „pole: wartość”
//   code     { label, language, code }
//   image    { dataUrl, alt, decorative, caption, fileName, width, height }
//   note     { title, intro, items: string[] } — ostrzeżenie o wersji roboczej

import { scopeLabel as describeScope } from "./frameworks.js";
import { SAMPLE_SIZES, SEVERITY_INFO, SEVERITY_LEGEND, withVersion, criteriaStats, environmentLabel, issuesByCriterion, issuesByView, samplePages, severityCounts, validateProject, CRITERION_STATUSES, SEVERITIES } from "./model.js";
import { cleanList, formatDate, formatPeriod, isSafeUrl, slug, text } from "./text.js";

export const GENERATOR_NAME = "Generator raportów dostępności A11y First";
export const GENERATOR_URL = "https://www.a11yfirst.pl/generator-raportow";

const r = (value) => [{ text: String(value ?? "") }];
const link = (url, label) => (isSafeUrl(url) ? [{ text: label || String(url).trim(), href: String(url).trim() }] : r(text(url)));
const internal = (anchor, label) => ({ text: label, anchor });
export const criterionAnchor = (id) => `kryterium-${slug(id)}`;
const heading = (level, value, id) => ({ type: "heading", level, text: value, id: id || slug(value) });
const para = (runs) => ({ type: "para", runs: typeof runs === "string" ? r(runs) : runs });
const list = (items, empty, ordered = false) => {
  const clean = cleanList(items);
  return clean.length ? { type: "list", ordered, items: clean.map(r) } : para(empty);
};

// Tekst z pól wielowierszowych: pusta linia = nowy akapit.
function paragraphs(value, fallback = "Nie podano.", edit = null) {
  const chunks = String(value ?? "").split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean);
  return (chunks.length ? chunks.map((chunk) => para(chunk)) : [para(fallback)]).map((block) => (edit ? { ...block, edit } : block));
}

// „Jak naprawić”: kilka wierszy bez pustych linii = lista punktów; inaczej akapity.
function pointsOrParagraphs(value, edit = null) {
  const raw = String(value ?? "").trim();
  const items = raw.split(/\n/).map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "").trim()).filter(Boolean);
  if (!/\n\s*\n/.test(raw) && items.length > 1) return [{ type: "list", ordered: false, items: items.map(r), edit }];
  return paragraphs(value, "Nie podano.", edit);
}

export const SECTIONS = [
  ["streszczenie", "Streszczenie menedżerskie"],
  ["informacje-ogolne", "Informacje ogólne"],
  ["podstawa-prawna", "Podstawa prawna i standard"],
  ["zakres-badania", "Zakres badania"],
  ["narzedzia", "Zastosowane narzędzia"],
  ["srodowisko", "Środowisko testowe"],
  ["podsumowanie-wynikow", "Podsumowanie wyników"],
  ["tabela-wcag", "Tabela zgodności z WCAG"],
  ["problemy", "Szczegółowa analiza problemów"],
  ["widoki", "Wyniki dla poszczególnych widoków"],
  ["rekomendacje", "Podsumowanie i rekomendacje"],
  ["ocena-koncowa", "Ocena końcowa"],
  ["zalaczniki", "Załączniki"],
];

const sectionHeading = (id) => heading(2, SECTIONS.find(([key]) => key === id)[1], id);

export function buildDocument(report) {
  const meta = report.meta || {};
  const summary = report.summary || {};
  const views = new Map((report.testedViews || []).map((view) => [view.id, view]));
  const validation = validateProject(report);
  const title = text(meta.reportTitle, "Raport z audytu dostępności cyfrowej");
  const scopeLabel = describeScope(meta);
  const byCriterion = issuesByCriterion(report);
  const requirements = new Map((report.criteriaResults || []).map((item) => [item.criterionId, item]));
  const blocks = [];

  if (validation.length) {
    blocks.push({
      type: "note",
      title: "Wersja robocza — raport wymaga uzupełnienia",
      intro: "Przed przekazaniem raportu uzupełnij lub potwierdź poniższe dane.",
      items: validation.map((item) => item.message),
    });
  }

  const allIssues = report.issues || [];
  blocks.push(sectionHeading("streszczenie"), ...paragraphs(summary.executiveSummary, "Nie przygotowano streszczenia menedżerskiego.", "summary.executiveSummary"));
  blocks.push(heading(3, "Problemy w skrócie", "problemy-w-skrocie"));
  if (allIssues.length) {
    const sorted = allIssues.map((issue, index) => ({ issue, index })).sort((a, b) => SEVERITIES.indexOf(a.issue.severity) - SEVERITIES.indexOf(b.issue.severity) || a.index - b.index);
    blocks.push({
      type: "table",
      caption: "Problemy według priorytetu",
      headers: ["Nr", "Problem", "Kryteria", "Priorytet"],
      rows: sorted.map(({ issue, index }) => [
        String(index + 1),
        [internal(`problem-${index + 1}`, text(issue.shortName || issue.title, "Bez tytułu"))],
        (issue.criteria || []).map((id) => requirements.get(id)?.displayId || id.replace(/^[a-z]+:/, "")).join(", ") || "—",
        issue.severity,
      ]),
      rowHeaders: true,
    }, para(SEVERITY_LEGEND));
  } else blocks.push(para("Nie opisano problemów dostępności."));

  blocks.push(sectionHeading("informacje-ogolne"), {
    type: "fields",
    label: "Informacje ogólne o badaniu",
    rows: [
      ["Podmiot badany", r(text(meta.auditedEntity))],
      ...(meta.sector ? [["Sektor", r(meta.sector)]] : []),
      ["Badany serwis", link(meta.websiteUrl)],
      ["Data audytu", r(formatDate(meta.auditDate))],
      ["Okres badania", r(formatPeriod(meta))],
      ["Zespół audytorski", r(text(cleanList(meta.experts).join(", ")))],
      ...(meta.auditingOrganization ? [["Organizacja audytująca", r(meta.auditingOrganization)]] : []),
      ["Standard i poziom", r(scopeLabel)],
      ["Data sporządzenia raportu", r(formatDate(summary.reportCreatedAt))],
    ],
  });

  blocks.push(
    sectionHeading("podstawa-prawna"),
    list(meta.legalBasis, "Nie podano podstawy prawnej."),
    para(`Badanie odnosi się do: ${scopeLabel}. Ocenie podlegają wszystkie kryteria sukcesu do wskazanego poziomu włącznie${(meta.extraGroups || []).length ? " oraz wybrane wymagania dodatkowe standardu" : ""}.`),
  );

  const viewItems = (report.testedViews || []).map((view) => [
    { text: text(view.name, "Widok bez nazwy"), bold: true },
    { text: view.isKeyView ? " (widok kluczowy)" : "" },
    { text: view.type ? `, ${view.type}` : "" },
    ...(view.url ? [{ text: ": " }, ...link(view.url)] : []),
  ]);
  blocks.push(
    sectionHeading("zakres-badania"),
    ...paragraphs(meta.auditScope, "Nie opisano zakresu badania.", "meta.auditScope"),
    heading(3, "Badane widoki", "badane-widoki"),
    viewItems.length ? { type: "list", ordered: true, items: viewItems } : para("Nie dodano badanych widoków."),
    heading(3, "Metodyka", "metodyka"),
    list(meta.methodology, "Nie opisano metodyki."),
  );
  const sample = samplePages(meta);
  if (meta.sampleSize) blocks.splice(blocks.findIndex((b) => b.id === "badane-widoki"), 0, para(`Wielkość próby: ${SAMPLE_SIZES[meta.sampleSize]?.label.toLowerCase() || "własna"}${sample ? ` — ${sample} stron lub widoków` : ""}. Zbadano ${(report.testedViews || []).length}.`));
  if (String(meta.excludedElements || "").trim()) blocks.push(heading(3, "Elementy wyłączone z badania", "elementy-wylaczone"), ...paragraphs(meta.excludedElements));
  if (String(meta.limitations || "").trim()) blocks.push(heading(3, "Ograniczenia badania", "ograniczenia-badania"), ...paragraphs(meta.limitations));

  const tools = report.tools || {};
  blocks.push(sectionHeading("narzedzia"));
  const readers = (report.assistiveTech || []).filter((item) => item.kind === "reader");
  const otherAt = (report.assistiveTech || []).filter((item) => item.kind !== "reader");
  blocks.push(
    heading(3, "Przeglądarki", "przegladarki"), list((report.browsers || []).map(withVersion), "Nie podano."),
    heading(3, "Czytniki ekranu", "czytniki-ekranu"), list(readers.map(withVersion), "Nie użyto."),
    heading(3, "Inne technologie asystujące", "inne-technologie-asystujace"), list(otherAt.map(withVersion), "Nie użyto."),
  );
  for (const [key, label] of [["manual", "Testy manualne"], ["automatic", "Narzędzia automatyczne"], ["userTesting", "Testy z udziałem użytkowników"]]) {
    blocks.push(heading(3, label), list(tools[key], "Nie dotyczy."));
  }
  const environments = report.environment || [];
  blocks.push(sectionHeading("srodowisko"));
  blocks.push(environments.length ? {
    type: "table",
    caption: "Środowiska, w których przeprowadzono badanie",
    headers: ["Środowisko", "Urządzenie", "System operacyjny", "Przeglądarka", "Technologia asystująca", "Rozdzielczość lub widok"],
    rowIds: environments.map((_, index) => `srodowisko-${index + 1}`),
    rows: environments.map((item, index) => [`Środowisko ${index + 1}`, text(item.device), text(item.operatingSystem), text(item.browser), text(item.assistiveTechnology, "Nie dotyczy"), text(item.viewport)]),
    rowHeaders: true,
  } : para("Nie podano środowiska testowego."));
  if (environments.length) blocks.push(para("Przy każdym problemie wskazano, w których środowiskach wystąpił. Brak wskazania oznacza wszystkie badane środowiska."));

  const stats = criteriaStats(report);
  const severities = severityCounts(report);
  const percent = summary.conformancePercent ?? null;
  blocks.push(sectionHeading("podsumowanie-wynikow"), {
    type: "fields",
    label: "Wynik badania",
    rows: [
      ["Ocena zgodności", r(text(summary.overallConformance, "Nie określono"))],
      ["Procent spełnionych kryteriów", r(percent === null || percent === "" ? (stats.percentPassed === null ? "Nie obliczono — nie wszystkie kryteria mają ocenę" : `${formatPercent(stats.percentPassed)} (obliczony z tabeli kryteriów)`) : formatPercent(percent))],
      ["Liczba opisanych problemów", r(String((report.issues || []).length))],
    ],
  }, {
    type: "table",
    caption: `Liczba kryteriów według statusu (${scopeLabel})`,
    headers: ["Status", "Liczba kryteriów"],
    rows: [...CRITERION_STATUSES.map((status) => [status, String(stats.counts[status] || 0)]), ["razem", String(stats.total)]],
    rowHeaders: true,
  }, {
    type: "table",
    caption: "Liczba problemów według priorytetu",
    headers: ["Priorytet", "Liczba problemów"],
    rows: SEVERITIES.map((severity) => [severity, String(severities[severity])]),
    rowHeaders: true,
  });

  const criteria = report.criteriaResults || [];
  const hasReaudit = criteria.some((item) => item.reauditStatus || item.reauditComment);
  blocks.push(sectionHeading("tabela-wcag"), {
    type: "table",
    caption: `Wyniki oceny kryteriów sukcesu ${scopeLabel}`,
    headers: ["Kryterium", "Poziom", "Status", "Problemy", "Komentarz audytora", ...(hasReaudit ? ["Reaudyt"] : [])],
    rowIds: criteria.map((item) => criterionAnchor(item.criterionId)),
    rows: criteria.length ? criteria.map((item) => [
      `${item.displayId || item.criterionId} ${item.title}`,
      item.level,
      item.status,
      issueLinks(byCriterion.get(item.criterionId)),
      text(item.auditComment, "—"),
      ...(hasReaudit ? [[item.reauditStatus, item.reauditComment].filter(Boolean).join(": ") || "—"] : []),
    ]) : [["Brak kryteriów", "", "", ""]],
    rowHeaders: true,
  });

  blocks.push(sectionHeading("problemy"));
  const issues = report.issues || [];
  if (!issues.length) blocks.push(para("Nie opisano problemów dostępności."));
  const ctx = { views, requirements, environments };
  if (meta.reportGrouping === "criteria" && issues.length) blocks.push(...groupedByCriteria(report, ctx));
  else if (meta.reportGrouping === "views" && issues.length) blocks.push(...groupedByViews(report, ctx));
  else issues.forEach((issue, index) => blocks.push(...issueBlocks(issue, index + 1, ctx, 3)));

  blocks.push(sectionHeading("widoki"));
  if (!(report.testedViews || []).length) blocks.push(para("Nie dodano badanych widoków."));
  for (const view of report.testedViews || []) {
    const linked = issues.map((issue, index) => ({ issue, index })).filter(({ issue }) => (issue.viewIds || []).includes(view.id));
    blocks.push(heading(3, text(view.name, "Widok bez nazwy"), `widok-${slug(view.id || view.name)}`));
    if (view.url) blocks.push(para([{ text: "Adres: " }, ...link(view.url)]));
    if (String(view.description || "").trim()) blocks.push(...paragraphs(view.description));
    blocks.push(linked.length
      ? { type: "list", ordered: false, items: linked.map(({ issue, index }) => [internal(`problem-${index + 1}`, `Problem ${index + 1}. ${text(issue.title, "Bez tytułu")}`), { text: ` (${issue.severity})` }]) }
      : para("Nie przypisano problemów do tego widoku."));
  }

  blocks.push(
    sectionHeading("rekomendacje"),
    heading(3, "Główne problemy", "glowne-problemy"),
    list(summary.mainProblems, "Nie wskazano głównych problemów."),
    heading(3, "Rekomendowane działania", "rekomendowane-dzialania"),
    list(summary.recommendedActions, "Nie wskazano działań."),
    heading(3, "Rekomendacja końcowa", "rekomendacja-koncowa"),
    ...paragraphs(summary.finalRecommendation, "Nie podano rekomendacji końcowej.", "summary.finalRecommendation"),
  );

  blocks.push(
    sectionHeading("ocena-koncowa"),
    ...paragraphs(summary.disclaimer, "Nie podano.", "summary.disclaimer"),
    para(`Termin ponownego audytu: ${formatDate(summary.reauditDeadline, "nie określono")}.`),
  );

  const attachments = (report.attachments || []).map((item) => [item.name, item.description].filter(Boolean).join(": "));
  blocks.push(sectionHeading("zalaczniki"), list(attachments, "Nie dołączono załączników."));

  return {
    title,
    subtitle: "Raport z audytu dostępności cyfrowej",
    entity: text(meta.auditedEntity, ""),
    lang: meta.reportLanguage || "pl-PL",
    authors: cleanList(meta.experts),
    footer: `Raport sporządzono ${formatDate(summary.reportCreatedAt, "bez daty")}. Ocena zgodności jest decyzją audytora. Dokument przygotowano w narzędziu ${GENERATOR_NAME}.`,
    isDraft: validation.length > 0,
    blocks,
  };
}

function issueLinks(indexes = []) {
  if (!indexes.length) return "—";
  return indexes.flatMap((index, n) => [...(n ? [{ text: ", " }] : []), internal(`problem-${index + 1}`, `Problem ${index + 1}`)]);
}

// Układ „według kryteriów”: nagłówek kryterium, pod nim jego problemy. Problem dotyczący kilku kryteriów
// jest opisany w całości przy pierwszym z nich, a przy pozostałych pojawia się odsyłacz.
function groupedByCriteria(report, ctx) {
  const issues = report.issues || [];
  const byCriterion = issuesByCriterion(report);
  const described = new Set();
  const blocks = [para("Problemy pogrupowano według kryteriów sukcesu. Problem, który narusza kilka kryteriów, opisano przy pierwszym z nich; przy pozostałych znajduje się odsyłacz.")];
  for (const item of report.criteriaResults || []) {
    const indexes = byCriterion.get(item.criterionId);
    if (!indexes?.length) continue;
    const label = `${item.displayId || item.criterionId} ${item.title}`;
    blocks.push(heading(3, `${label} — ${countLabel(indexes.length)}`, `grupa-${criterionAnchor(item.criterionId)}`));
    blocks.push(para([{ text: `Poziom ${item.level}, status: ${item.status}. ` }, internal(criterionAnchor(item.criterionId), "Wiersz w tabeli zgodności")]));
    const references = [];
    for (const index of indexes) {
      if (described.has(index)) references.push(index);
      else {
        described.add(index);
        blocks.push(...issueBlocks(issues[index], index + 1, ctx, 4));
      }
    }
    if (references.length) {
      blocks.push({ type: "list", ordered: false, items: references.map((index) => [internal(`problem-${index + 1}`, `Problem ${index + 1}. ${text(issues[index].title, "Bez tytułu")}`), { text: " — opisany wcześniej, przy innym kryterium." }]) });
    }
  }
  const orphans = issues.map((issue, index) => index).filter((index) => !described.has(index));
  if (orphans.length) {
    blocks.push(heading(3, "Problemy bez przypisanego kryterium", "grupa-bez-kryterium"));
    orphans.forEach((index) => blocks.push(...issueBlocks(issues[index], index + 1, ctx, 4)));
  }
  return blocks;
}

function viewRuns(issue, ctx) {
  const names = (issue.viewIds || []).map((id) => ctx.views.get(id)?.name).filter(Boolean);
  return r(names.length ? names.join("; ") : "Nie wskazano");
}

function environmentRuns(issue, ctx) {
  const ids = issue.environmentIds || [];
  if (!ctx.environments.length) return r("Nie podano środowisk");
  if (!ids.length || ids.length === ctx.environments.length) return r("Wszystkie badane środowiska");
  return ids.flatMap((id, n) => {
    const index = ctx.environments.findIndex((env) => env.id === id);
    return index < 0 ? [] : [...(n ? [{ text: "; " }] : []), internal(`srodowisko-${index + 1}`, environmentLabel(ctx.environments[index], index))];
  });
}

// Układ „według widoków” (jak w szablonie a11yfirst): problemy pod widokiem, w którym występują.
// Problem powtarzający się w kilku widokach jest opisany raz, przy pierwszym; dalej jest odsyłacz.
function groupedByViews(report, ctx) {
  const issues = report.issues || [];
  const byView = issuesByView(report);
  const described = new Set();
  const blocks = [para("Problemy pogrupowano według badanych widoków. Problem występujący w kilku widokach opisano przy pierwszym z nich; przy kolejnych znajduje się odsyłacz.")];
  (report.testedViews || []).forEach((view, v) => {
    const indexes = byView.get(view.id) || [];
    blocks.push(heading(3, `Widok ${v + 1}. ${text(view.name, "bez nazwy")} — ${indexes.length ? countLabel(indexes.length) : "bez problemów"}`, `grupa-widok-${v + 1}`));
    if (view.url) blocks.push(para([{ text: "Adres: " }, ...link(view.url)]));
    if (!indexes.length) blocks.push(para("W tym widoku nie stwierdzono problemów."));
    const references = [];
    for (const index of indexes) {
      if (described.has(index)) references.push(index);
      else { described.add(index); blocks.push(...issueBlocks(issues[index], index + 1, ctx, 4)); }
    }
    if (references.length) blocks.push({ type: "list", ordered: false, items: references.map((index) => [internal(`problem-${index + 1}`, `Problem ${index + 1}. ${text(issues[index].title, "Bez tytułu")}`), { text: " — opisany wcześniej, przy innym widoku." }]) });
  });
  const orphans = issues.map((_, index) => index).filter((index) => !described.has(index));
  if (orphans.length) {
    blocks.push(heading(3, "Problemy bez przypisanego widoku", "grupa-bez-widoku"));
    orphans.forEach((index) => blocks.push(...issueBlocks(issues[index], index + 1, ctx, 4)));
  }
  return blocks;
}

function countLabel(n) {
  if (n === 1) return "1 problem";
  const tens = n % 100;
  const units = n % 10;
  return `${n} ${units >= 2 && units <= 4 && (tens < 12 || tens > 14) ? "problemy" : "problemów"}`;
}

function issueBlocks(issue, number, ctx, level) {
  const view = ctx.views.get(issue.viewId) || {};
  const criteriaRuns = (issue.criteria || []).flatMap((id, n) => {
    const item = ctx.requirements.get(id);
    const label = item ? `${item.displayId || id} ${item.title}${item.level !== "—" ? ` (${item.level})` : ""}` : `${id} (poza zakresem raportu)`;
    return [...(n ? [{ text: "; " }] : []), item ? internal(criterionAnchor(id), label) : { text: label }];
  });
  const url = issue.url || view.url;
  const rows = [
    ["Identyfikator", r(text(issue.id))],
    ["Widoki", viewRuns(issue, ctx)],
    ["Środowiska", environmentRuns(issue, ctx)],
    ...(url ? [["Adres", link(url)]] : []),
    ["Typ", r(issue.issueType)],
    ["Priorytet", r(`${issue.severity} — ${SEVERITY_INFO[issue.severity] || ""}`)],
    ["Kryteria", criteriaRuns.length ? criteriaRuns : r("Nie przypisano")],
    ...(issue.reauditStatus ? [["Status reaudytu", r([issue.reauditStatus, issue.reauditComment].filter(Boolean).join(": "))]] : []),
  ];
  const id = `problem-${number}`;
  const blocks = [
    { ...heading(level, `Problem ${number}. ${text(issue.title, "Bez tytułu")}`, id), edit: `issues.${number - 1}.title` },
    { type: "fields", label: `Dane problemu ${number}`, rows },
    heading(level + 1, "Opis problemu", `${id}-opis`),
    ...paragraphs(issue.description, "Nie podano.", `issues.${number - 1}.description`),
  ];
  const steps = cleanList(issue.stepsToReproduce);
  if (steps.length) blocks.push(heading(level + 1, "Kroki odtworzenia", `${id}-kroki`), { type: "list", ordered: true, items: steps.map(r) });
  blocks.push(heading(level + 1, "Wpływ na użytkowników", `${id}-wplyw`), ...paragraphs(issue.userImpact, "Nie podano.", `issues.${number - 1}.userImpact`));
  blocks.push(heading(level + 1, "Jak naprawić", `${id}-rekomendacja`), ...pointsOrParagraphs(issue.recommendation, `issues.${number - 1}.recommendation`));
  if (String(issue.evidence || "").trim()) blocks.push(heading(level + 1, "Dowody i lokalizacja", `${id}-dowody`), ...paragraphs(issue.evidence, "Nie podano.", `issues.${number - 1}.evidence`));
  (issue.codeExamples || []).forEach((code) => blocks.push({ type: "code", label: text(code.label, "Fragment kodu"), language: text(code.language, "text"), code: String(code.code ?? "") }));
  (issue.images || []).forEach((image) => blocks.push({ type: "image", ...image }));
  if (issue.includeNotesInExport && String(issue.notes || "").trim()) blocks.push(heading(level + 1, "Uwagi audytora", `${id}-uwagi`), ...paragraphs(issue.notes));
  return blocks;
}

function formatPercent(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${String(number).replace(".", ",")}%` : String(value);
}

// Szkic streszczenia menedżerskiego z danych raportu — punkt wyjścia do zredagowania przez audytora.
// Podaje wyłącznie fakty z projektu; nie ocenia zgodności.
export function draftExecutiveSummary(report) {
  const meta = report.meta || {};
  const issues = report.issues || [];
  const stats = criteriaStats(report);
  const counts = severityCounts(report);
  const entity = text(meta.auditedEntity, "badanego podmiotu");
  const site = text(meta.websiteUrl, "badany serwis");
  const date = meta.auditDate ? ` w dniu ${formatDate(meta.auditDate)}` : "";
  const views = (report.testedViews || []).length;
  const plural = (n, one, few, many) => (n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many);
  const parts = [
    `Audyt dostępności cyfrowej serwisu ${site} (${entity}) przeprowadzono${date} względem: ${describeScope(meta)}. Badaniem objęto ${views} ${plural(views, "widok", "widoki", "widoków")}.`,
  ];
  if (issues.length) {
    parts.push(`Zidentyfikowano ${issues.length} ${plural(issues.length, "problem", "problemy", "problemów")} z dostępnością: ${counts["Priorytet 1"]} z priorytetem 1 (do naprawy w pierwszej kolejności), ${counts["Priorytet 2"]} z priorytetem 2 (w drugiej kolejności) i ${counts["Priorytet 3"]} z priorytetem 3 (rekomendacje).`);
    const urgent = issues.filter((issue) => issue.severity === "Priorytet 1").slice(0, 3).map((issue) => text(issue.shortName || issue.title, "").toLowerCase()).filter(Boolean);
    if (urgent.length) parts.push(`Najpilniejsze do usunięcia: ${urgent.join("; ")}.`);
  } else parts.push("W badanym zakresie nie opisano problemów z dostępnością.");
  const decided = stats.counts["spełnione"] + stats.counts["niespełnione"] + stats.counts["nie dotyczy"];
  parts.push(`Spośród ${stats.total} ${plural(stats.total, "ocenianego wymagania", "ocenianych wymagań", "ocenianych wymagań")} ${stats.counts["niespełnione"]} ${plural(stats.counts["niespełnione"], "nie jest spełnione", "nie są spełnione", "nie jest spełnionych")}${decided < stats.total ? `, a ${stats.total - decided} wymaga jeszcze oceny lub weryfikacji` : ""}.`);
  parts.push("[Dopisz: co oznacza ten wynik dla użytkowników i organizacji oraz jaki jest rekomendowany następny krok.]");
  return parts.join("\n\n");
}
