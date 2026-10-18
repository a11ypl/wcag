// Import danych do raportu: projekt JSON, wyniki badania automatycznego w formacie wcagus (CSV + manifest)
// oraz surowe wyniki axe-core. Zasada: automat niczego nie potwierdza — „test zaliczony” nie staje się
// „spełnione”, a każdy zaimportowany status i problem czeka na potwierdzenie audytora.

import { criterionById } from "./criteria.js";
import { localDate, migrateProject, newIssue, nextId, randomId, refreshCriteria, suggestCriterionStatuses } from "./model.js";

const WCAGUS = "wcagus";
const safeUrl = (value) => { try { return new URL(value); } catch { return null; } };
const AXE = "axe-core";

export function parseCsv(input) {
  const source = String(input ?? "").replace(/^﻿/, "");
  const firstLine = source.split(/\r?\n/, 1)[0] || "";
  const delimiter = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === "") quoted = true;
    else if (ch === delimiter) { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  const [header = [], ...data] = rows;
  const keys = header.map((key) => key.trim().toLowerCase());
  return data.map((values) => Object.fromEntries(keys.map((key, index) => [key, (values[index] ?? "").trim()])));
}

// Rozpoznaje rodzaj pliku po zawartości, nie po nazwie.
export function detectFile(name, content) {
  const trimmed = String(content ?? "").replace(/^﻿/, "").trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    let data;
    try { data = JSON.parse(trimmed); } catch { return { kind: "unknown", name, reason: "Plik nie jest poprawnym JSON." }; }
    if (Array.isArray(data) ? data.some(isAxeResult) : isAxeResult(data)) return { kind: "axe", name, data: Array.isArray(data) ? data.filter(isAxeResult) : [data] };
    if (data && data.run_id && Array.isArray(data.strony)) return { kind: "wcagus-manifest", name, data };
    if (data && typeof data === "object" && !Array.isArray(data) && (data.meta || data.criteriaResults || data.format)) return { kind: "project", name, data };
    return { kind: "unknown", name, reason: "Nie rozpoznano struktury JSON." };
  }
  const rows = parseCsv(trimmed);
  const keys = new Set(Object.keys(rows[0] || {}));
  if (keys.has("kryterium") && keys.has("ocena")) return { kind: "wcagus-matrix", name, data: rows };
  if (keys.has("ustalenie") && keys.has("waga")) return { kind: "wcagus-findings", name, data: rows };
  if (keys.has("pytanie_do_rozstrzygniecia")) return { kind: "wcagus-questions", name, data: rows };
  return { kind: "unknown", name, reason: "Nie rozpoznano formatu pliku." };
}

function isAxeResult(value) {
  return Boolean(value && typeof value === "object" && Array.isArray(value.violations) && (value.testEngine || value.url || Array.isArray(value.incomplete)));
}

// files: [{ name, text }]. Zwraca nowy obiekt raportu i komunikaty dla użytkownika.
export function importFiles(currentReport, files) {
  const detected = files.map((file) => detectFile(file.name, file.text));
  const messages = [];
  const project = detected.find((item) => item.kind === "project");
  let report = project ? migrateProject(project.data) : structuredClone(currentReport);
  if (project) messages.push(`Wczytano projekt raportu z pliku ${project.name}.`);

  const manifest = detected.find((item) => item.kind === "wcagus-manifest");
  if (manifest) messages.push(...applyManifest(report, manifest.data));
  const matrix = detected.find((item) => item.kind === "wcagus-matrix");
  if (matrix) messages.push(...applyMatrix(report, matrix.data));
  const findings = detected.find((item) => item.kind === "wcagus-findings");
  if (findings) messages.push(...applyFindings(report, findings.data));
  for (const axe of detected.filter((item) => item.kind === "axe")) messages.push(...applyAxe(report, axe.data, axe.name));

  for (const item of detected) {
    if (item.kind === "unknown") messages.push(`Pominięto plik ${item.name}: ${item.reason}`);
    if (item.kind === "wcagus-questions") messages.push(`Plik ${item.name} pominięto — pytania do audytora są już w komentarzach kryteriów z macierzy.`);
  }
  if (!detected.some((item) => item.kind !== "unknown" && item.kind !== "wcagus-questions")) {
    throw new Error(messages.join(" ") || "Nie rozpoznano żadnego pliku.");
  }
  suggestCriterionStatuses(report);
  return { report, messages };
}

function setIfEmpty(object, key, value) {
  if (value && !String(object[key] ?? "").trim()) object[key] = value;
}

function addUnique(list, value) {
  if (value && !list.includes(value)) list.push(value);
}

function ensureView(report, url, name, type = "strona") {
  const existing = report.testedViews.find((view) => (url ? view.url === url : !view.url && view.name === name));
  if (existing) return existing;
  const view = { id: randomId(), name, url: url || "", type, description: "", isKeyView: false };
  report.testedViews.push(view);
  return view;
}

function applyManifest(report, manifest) {
  const meta = report.meta;
  const host = manifest.cel?.host_badany || manifest.cel?.host_punktu_startowego || "";
  const window = manifest.okno_przebiegu_utc || {};
  setIfEmpty(meta, "websiteUrl", host);
  setIfEmpty(meta, "auditedEntity", safeUrl(host)?.hostname.replace(/^www\./, "") || "");
  if (window.start) {
    setIfEmpty(meta, "auditDate", localDate(window.start));
    setIfEmpty(meta, "auditStartDate", localDate(window.start));
  }
  const end = window.ostatni_pomiar || window.koniec;
  if (end) setIfEmpty(meta, "auditEndDate", localDate(end));

  const pages = manifest.strony || [];
  const ok = pages.filter((page) => !page.status || page.status === "ok");
  const before = report.testedViews.length;
  for (const page of ok) {
    const path = safeUrl(page.url)?.pathname || "";
    ensureView(report, page.url, path === "/" ? "Strona główna" : decodeURIComponent(path.replace(/^\//, "")) || page.slug || page.url);
  }
  const scope = manifest.zakres || {};
  setIfEmpty(meta, "auditScope", `Badanie automatyczne objęło ${scope.liczba_stron_zbadanych ?? ok.length} stron serwisu${scope.pokrycie ? ` (${scope.pokrycie})` : ""}. Wyniki badania automatycznego wymagają weryfikacji przez audytora.`);

  const engine = manifest.srodowisko?.silnik_pomiarowy || {};
  addUnique(report.tools.automatic, `axe-core uruchamiany w przeglądarce Chromium${engine.chromium ? ` ${engine.chromium}` : ""} (Playwright)`);
  addUnique(meta.methodology, "Badanie automatyczne wszystkich stron z zakresu, a następnie weryfikacja wyników przez audytora.");
  if (engine.chromium && !report.browsers.some((item) => item.name === "Chromium (przebieg automatyczny)")) {
    report.browsers.push({ id: randomId(), name: "Chromium (przebieg automatyczny)", version: engine.chromium });
  }
  if (engine.chromium && !report.environment.some((item) => item.source === WCAGUS)) {
    report.environment.push({
      id: randomId(),
      device: "Przebieg automatyczny",
      operatingSystem: manifest.srodowisko?.system?.os || "",
      browser: `Chromium ${engine.chromium} (bez interfejsu)`,
      assistiveTechnology: "Nie dotyczy",
      viewport: "",
      notes: "",
      source: WCAGUS,
    });
  }
  const failed = pages.length - ok.length;
  return [`Z manifestu dodano ${report.testedViews.length - before} badanych widoków${failed ? `; ${failed} stron z błędem pomiaru pominięto` : ""}.`];
}

const MATRIX_STATUS = {
  "test zaliczony w badanym zakresie": ["do weryfikacji", "Test automatyczny zaliczony w badanym zakresie — nie potwierdza zgodności."],
  "wykryto niezgodność deterministyczną": ["niespełnione", "Niezgodność wykryta pomiarem."],
  "wymaga człowieka": ["do weryfikacji", "Wymaga oceny audytora."],
  "nie dotyczy": ["nie dotyczy", "W badanym zakresie nie znaleziono treści, których dotyczy kryterium."],
};

function applyMatrix(report, rows) {
  if (rows.some((row) => /^tak$/i.test(row.nowe_w_2_2 || "")) && report.meta.standard !== "WCAG 2.2" && report.criteriaResults.every((item) => item.status === "niebadane" || item.autoFilled)) {
    report.meta.standard = "WCAG 2.2";
    refreshCriteria(report);
  }
  const byId = new Map(report.criteriaResults.map((item) => [item.criterionId, item]));
  let applied = 0;
  let skipped = 0;
  for (const row of rows) {
    const target = byId.get(row.kryterium);
    if (!target) { skipped++; continue; }
    const [status, prefix] = MATRIX_STATUS[String(row.ocena || "").trim().toLowerCase()] || ["do weryfikacji", `Ocena automatyczna: ${row.ocena || "brak"}.`];
    const question = row.pytanie_dla_czlowieka ? ` Do rozstrzygnięcia: ${row.pytanie_dla_czlowieka}` : "";
    target.status = status;
    target.auditComment = `${prefix} ${row.uzasadnienie || ""}${question}`.replace(/\s+/g, " ").trim();
    target.source = WCAGUS;
    target.confirmed = false;
    target.manualOverride = true;
    target.autoFilled = false;
    applied++;
  }
  return [`Zaimportowano oceny ${applied} kryteriów — każda wymaga potwierdzenia audytora.${skipped ? ` Pominięto ${skipped} kryteriów spoza wybranego standardu lub poziomu.` : ""}`];
}

const SEVERITY_FROM_WEIGHT = [[/^kryty/i, "Priorytet 1"], [/^wysok/i, "Priorytet 1"], [/^średn|^sredn/i, "Priorytet 2"], [/^nisk/i, "Priorytet 3"]];

function applyFindings(report, rows) {
  const siteView = report.testedViews.length === 1
    ? report.testedViews[0]
    : ensureView(report, "", "Cały badany serwis", "inne");
  let added = 0;
  for (const row of rows) {
    const id = row.ustalenie || nextId("A11Y", report.issues);
    if (report.issues.some((issue) => issue.source === WCAGUS && issue.id === id)) continue;
    const weight = String(row.waga || "").trim();
    const severity = SEVERITY_FROM_WEIGHT.find(([pattern]) => pattern.test(weight))?.[1] || "Priorytet 2";
    const impact = weight.includes("—") ? weight.split("—").slice(1).join("—").trim() : "";
    report.issues.push(newIssue({
      id,
      title: shortTitle(row),
      viewId: siteView.id,
      criteria: criterionById(row.kryterium) ? [row.kryterium] : [],
      description: row.opis || "",
      userImpact: impact ? capitalize(impact) : "",
      recommendation: row.zalecenie || "",
      evidence: row.podstawa_pomiarowa || "",
      severity,
      issueType: "błąd",
      source: WCAGUS,
      confirmed: false,
    }));
    added++;
  }
  return [`Dodano ${added} problemów z listy ustaleń. Uzupełnij opis wpływu na użytkowników tam, gdzie go brakuje.`];
}

function shortTitle(row) {
  const sentence = String(row.opis || "").split(/(?<=[.!?])\s/)[0].replace(/[.:;]$/, "");
  const base = sentence.length > 110 ? `${sentence.slice(0, 107).replace(/\s+\S*$/, "")}…` : sentence;
  return base || `${row.kryterium} ${row.nazwa}`.trim();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const AXE_SEVERITY = { critical: "Priorytet 1", serious: "Priorytet 1", moderate: "Priorytet 2", minor: "Priorytet 3" };

function axeCriteria(tags = []) {
  return [...new Set(tags.map((tag) => tag.match(/^wcag(\d)(\d)(\d+)$/)).filter(Boolean).map((m) => `${m[1]}.${m[2]}.${m[3]}`))];
}

function applyAxe(report, results, fileName) {
  const valid = new Set(report.criteriaResults.map((item) => item.criterionId));
  let added = 0;
  for (const result of results) {
    const url = result.url || "";
    const path = safeUrl(url)?.pathname;
    const view = path ? ensureView(report, url, path === "/" ? "Strona główna" : decodeURIComponent(path.replace(/^\//, ""))) : ensureView(report, "", `Wyniki z pliku ${fileName}`, "inne");
    for (const [bucket, type] of [["violations", "błąd"], ["incomplete", "do weryfikacji manualnej"]]) {
      for (const rule of result[bucket] || []) {
        const criteria = axeCriteria(rule.tags).filter((id) => valid.has(id));
        if (!criteria.length && type === "do weryfikacji manualnej") continue;
        const key = `${AXE}:${rule.id}:${url}:${bucket}`;
        if (report.issues.some((issue) => issue.sourceKey === key)) continue;
        const nodes = rule.nodes || [];
        const targets = nodes.slice(0, 20).map((node) => [].concat(node.target || []).join(" "));
        const evidence = [
          `Reguła axe-core „${rule.id}”: ${nodes.length} elementów${bucket === "incomplete" ? " z wynikiem nierozstrzygniętym" : ""}.`,
          ...targets.map((target) => `• ${target}`),
          nodes.length > targets.length ? `Pokazano ${targets.length} z ${nodes.length} elementów.` : "",
        ].filter(Boolean).join("\n");
        report.issues.push(newIssue({
          id: nextId("A11Y", report.issues),
          title: rule.help || rule.id,
          viewId: view.id,
          url,
          criteria,
          description: rule.description || "",
          recommendation: [nodes[0]?.failureSummary, rule.helpUrl ? `Opis reguły: ${rule.helpUrl}` : ""].filter(Boolean).join("\n\n"),
          evidence,
          severity: AXE_SEVERITY[rule.impact] || "Priorytet 2",
          issueType: criteria.length ? type : "rekomendacja",
          source: AXE,
          sourceKey: key,
          confirmed: false,
        }));
        added++;
      }
    }
  }
  addUnique(report.tools.automatic, results[0]?.testEngine?.version ? `axe-core ${results[0].testEngine.version}` : "axe-core");
  return [`Z pliku ${fileName} dodano ${added} problemów z axe-core. Teksty reguł axe są po angielsku — przeredaguj je i opisz wpływ na użytkowników.`];
}
