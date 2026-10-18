// Model danych raportu: wartości domyślne, migracja, walidacja i statystyki.
// Format zgodny wstecz z projektami JSON z Raportownika (schemaVersion 1).

import { normalizeScope, requirementsFor } from "./frameworks.js";

export const SCHEMA_VERSION = 1;
export const FORMAT_ID = "a11yfirst-raport";
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export const CRITERION_STATUSES = ["spełnione", "niespełnione", "nie dotyczy", "do weryfikacji", "niebadane"];
export const ISSUE_TYPES = ["błąd", "rekomendacja", "do weryfikacji manualnej"];
export const SEVERITIES = ["Priorytet 1", "Priorytet 2", "Priorytet 3"];
export const SEVERITY_INFO = {
  "Priorytet 1": "do naprawy w pierwszej kolejności",
  "Priorytet 2": "do naprawy w drugiej kolejności",
  "Priorytet 3": "do wdrożenia na końcu (rekomendacje)",
};
export const SEVERITY_LEGEND = SEVERITIES.map((item) => `${item} — ${SEVERITY_INFO[item]}`).join(". ") + ".";
// Skala z wcześniejszych wersji (P1–P4) i z innych narzędzi → priorytet 1–3.
const LEGACY_SEVERITY = { "P1 krytyczny": "Priorytet 1", "P2 wysoki": "Priorytet 1", "P3 średni": "Priorytet 2", "P4 niski": "Priorytet 3" };
export function normalizeSeverity(value) {
  if (SEVERITIES.includes(value)) return value;
  if (LEGACY_SEVERITY[value]) return LEGACY_SEVERITY[value];
  const digit = String(value || "").match(/[123]/)?.[0];
  return digit ? `Priorytet ${digit}` : "Priorytet 2";
}
export const REAUDIT_STATUSES = ["", "naprawione", "nienaprawione", "częściowo naprawione", "nie badano ponownie"];
export const VIEW_TYPES = ["strona", "formularz", "dokument", "multimedia", "aplikacja", "komponent", "inne"];
export const CONFORMANCE_OPTIONS = ["", "zgodna", "częściowo zgodna", "niezgodna"];
export const SECTORS = ["", "publiczny", "prywatny"];
export const GROUPINGS = { problems: "według problemów", criteria: "według kryteriów sukcesu", views: "według widoków" };
export const SAMPLE_SIZES = {
  maly: { label: "Mały audyt", pages: 5 },
  sredni: { label: "Średni audyt", pages: 10 },
  duzy: { label: "Duży audyt", pages: 20 },
  wlasny: { label: "Własna wielkość próby", pages: null },
};

export function samplePages(meta) {
  const size = SAMPLE_SIZES[meta?.sampleSize];
  if (!size) return null;
  if (size.pages) return size.pages;
  const custom = Number(meta.sampleSizeCustom);
  return Number.isFinite(custom) && custom > 0 ? Math.round(custom) : null;
}

export function environmentLabel(env, index) {
  const parts = [env.device, env.operatingSystem, env.browser, env.assistiveTechnology && !/^nie dotyczy/i.test(env.assistiveTechnology) ? env.assistiveTechnology : ""].map((part) => String(part || "").trim()).filter(Boolean);
  return `Środowisko ${index + 1}${parts.length ? `: ${parts.join(" · ")}` : ""}`;
}

export const DEFAULT_DISCLAIMER =
  "Audyt określa stan dostępności badanego serwisu na dzień wskazany w raporcie. " +
  "Raport obejmuje wyłącznie zakres opisany w sekcji „Zakres badania”. Błędy " +
  "powstałe po dacie audytu lub poza wskazanym zakresem nie są objęte niniejszą oceną.";

export const DEPRECATED_411_NOTE =
  "Kryterium 4.1.1 zostało usunięte z WCAG 2.2. Errata W3C do WCAG 2.0 i 2.1 stanowi, że dla treści w HTML " +
  "lub XML należy je uznać za zawsze spełnione. Status uzupełniony automatycznie, bo raport nie zawierał " +
  "oceny tego kryterium.";

export function todayLocal(now = new Date()) {
  return localDate(now);
}

// Data dzienna w strefie Europe/Warsaw (daty z UTC wieczorem to już następny dzień w Polsce).
export function localDate(value, timeZone = "Europe/Warsaw") {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function defaultProject() {
  const standard = "WCAG 2.2";
  const level = "AA";
  const report = {
    format: FORMAT_ID,
    schemaVersion: SCHEMA_VERSION,
    meta: {
      reportTitle: "Raport z audytu dostępności cyfrowej",
      signature: "",
      auditStatus: "w toku",
      auditedEntity: "",
      sector: "",
      websiteUrl: "",
      auditDate: "",
      auditStartDate: "",
      auditEndDate: "",
      experts: [],
      auditingOrganization: "",
      auditScope: "",
      sampleSize: "",
      sampleSizeCustom: null,
      excludedElements: "",
      limitations: "",
      methodology: [],
      legalBasis: [],
      framework: "wcag",
      frameworkVersion: "2.2",
      extraGroups: [],
      standard,
      conformanceLevel: level,
      reportLanguage: "pl-PL",
      reportGrouping: "problems",
    },
    placeholders: [],
    testedViews: [],
    tools: { automatic: [], manual: [], assistiveTechnologies: [], userTesting: [] },
    browsers: [],
    assistiveTech: [],
    environment: [],
    criteriaResults: [],
    issues: [],
    summary: {
      overallConformance: "",
      conformancePercent: null,
      mainProblems: [],
      recommendedActions: [],
      finalRecommendation: "",
      executiveSummary: "",
      reauditDeadline: "",
      reportCreatedAt: todayLocal(),
      disclaimer: DEFAULT_DISCLAIMER,
    },
    attachments: [],
  };
  refreshCriteria(report);
  return report;
}

export function migrateProject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Dane projektu muszą być obiektem JSON.");
  }
  const version = data.schemaVersion ?? 0;
  if (version !== 0 && version !== SCHEMA_VERSION) {
    throw new Error(`Nieobsługiwana wersja danych projektu: ${version}.`);
  }
  const merged = deepMerge(defaultProject(), data);
  // Projekty sprzed kreatora zakresu (np. z Raportownika) mają tylko meta.standard.
  if (!data.meta?.framework && data.meta?.standard) {
    merged.meta.framework = "wcag";
    merged.meta.frameworkVersion = String(data.meta.standard).replace("WCAG ", "");
  }
  merged.format = FORMAT_ID;
  merged.schemaVersion = SCHEMA_VERSION;
  for (const key of ["testedViews", "environment", "issues", "attachments", "placeholders", "browsers", "assistiveTech"]) {
    if (!Array.isArray(merged[key])) merged[key] = [];
  }
  // Starsze projekty: technologie asystujące jako wiersze tekstu → lista z polem wersji.
  if (!merged.assistiveTech.length && (merged.tools.assistiveTechnologies || []).length) {
    merged.assistiveTech = merged.tools.assistiveTechnologies.map((name) => ({ id: randomId(), name: String(name), version: "", kind: "other" }));
  }
  merged.tools.assistiveTechnologies = [];
  merged.browsers = merged.browsers.filter((item) => item && item.name).map((item) => ({ id: item.id || randomId(), name: String(item.name), version: String(item.version || "") }));
  merged.assistiveTech = merged.assistiveTech.filter((item) => item && item.name).map((item) => ({ id: item.id || randomId(), name: String(item.name), version: String(item.version || ""), kind: item.kind || "other" }));
  merged.issues = merged.issues.map(normalizeIssue);
  const envIds = new Set(merged.environment.map((env) => env.id));
  merged.issues.forEach((issue) => { issue.environmentIds = issue.environmentIds.filter((id) => envIds.has(id)); });
  refreshCriteria(merged);
  return merged;
}

function deepMerge(base, incoming) {
  if (isPlainObject(base) && isPlainObject(incoming)) {
    const result = structuredClone(base);
    for (const [key, value] of Object.entries(incoming)) {
      result[key] = key in result ? deepMerge(result[key], value) : structuredClone(value);
    }
    return result;
  }
  return incoming === undefined ? structuredClone(base) : structuredClone(incoming);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function newIssue(overrides = {}) {
  return normalizeIssue({
    id: "",
    title: "",
    viewId: "",
    viewIds: [],
    environmentIds: [],
    url: "",
    criteria: [],
    description: "",
    stepsToReproduce: [],
    userImpact: "",
    recommendation: "",
    evidence: "",
    severity: "Priorytet 2",
    shortName: "",
    issueType: "błąd",
    codeExamples: [],
    images: [],
    notes: "",
    includeNotesInExport: false,
    reauditStatus: "",
    reauditComment: "",
    source: "",
    confirmed: true,
    ...overrides,
  });
}

function normalizeIssue(issue) {
  const item = { ...issue };
  for (const key of ["criteria", "stepsToReproduce", "codeExamples", "images", "viewIds", "environmentIds"]) {
    if (!Array.isArray(item[key])) item[key] = [];
  }
  for (const key of ["id", "title", "viewId", "url", "description", "userImpact", "recommendation", "evidence", "notes", "reauditStatus", "reauditComment", "source"]) {
    item[key] = item[key] == null ? "" : String(item[key]);
  }
  // Problem może dotyczyć kilku widoków; viewId to widok główny (pierwszy) — zgodność ze starszymi projektami.
  if (!item.viewIds.length && item.viewId) item.viewIds = [String(item.viewId)];
  item.viewId = item.viewIds[0] || "";
  item.severity = normalizeSeverity(item.severity);
  item.shortName = item.shortName == null ? "" : String(item.shortName);
  if (!ISSUE_TYPES.includes(item.issueType)) item.issueType = "błąd";
  if (item.reauditStatus === "nie badano ponownie") item.reauditStatus = "";
  item.includeNotesInExport = Boolean(item.includeNotesInExport);
  item.confirmed = item.confirmed === undefined ? !item.source : Boolean(item.confirmed);
  // Obraz bez tekstu alternatywnego jest dekoracyjny. W starszych projektach alt obrazu dekoracyjnego
  // nie trafiał do raportu, więc go czyścimy, żeby wynik się nie zmienił.
  item.images = item.images.filter(isPlainObject).map((image) => {
    const alt = image.isDecorative ? "" : String(image.alt ?? "");
    return { ...image, alt, isDecorative: !alt.trim() };
  });
  return item;
}

export function isDecorativeImage(image) {
  return !String(image?.alt || "").trim();
}

// Dopasowuje listę kryteriów do standardu i poziomu, zachowując istniejące oceny.
export function refreshCriteria(report) {
  const meta = normalizeScope(report.meta || (report.meta = {}));
  if (!GROUPINGS[meta.reportGrouping]) meta.reportGrouping = "problems";
  const existing = new Map((report.criteriaResults || []).filter(isPlainObject).map((item) => [item.criterionId, item]));
  report.criteriaResults = requirementsFor(meta).map((criterion) => {
    const current = existing.get(criterion.id) || {};
    const status = CRITERION_STATUSES.includes(current.status) ? current.status : "niebadane";
    const result = {
      criterionId: criterion.id,
      displayId: criterion.displayId,
      title: criterion.title,
      level: criterion.level,
      principle: criterion.principle,
      group: criterion.group,
      extra: Boolean(criterion.extra),
      status,
      auditComment: current.auditComment || "",
      reauditStatus: current.reauditStatus || "",
      reauditComment: current.reauditComment || "",
      manualOverride: Boolean(current.manualOverride),
      source: current.source || "",
      confirmed: current.confirmed === undefined ? !current.source : Boolean(current.confirmed),
      autoFilled: Boolean(current.autoFilled),
      suggested: Boolean(current.suggested),
    };
    if (criterion.id === "4.1.1" && status === "niebadane" && !result.auditComment) {
      result.status = "spełnione";
      result.auditComment = DEPRECATED_411_NOTE;
      result.autoFilled = true;
    }
    return result;
  });
  suggestCriterionStatuses(report);
  return report;
}

// Kryterium z problemem typu „błąd” proponujemy jako niespełnione, dopóki audytor nie zdecyduje inaczej.
export function suggestCriterionStatuses(report) {
  const failed = new Set();
  for (const issue of report.issues || []) {
    if (issue.issueType === "błąd") (issue.criteria || []).forEach((id) => failed.add(id));
  }
  for (const criterion of report.criteriaResults || []) {
    if (criterion.manualOverride) continue;
    if (failed.has(criterion.criterionId)) {
      if (criterion.status !== "niespełnione") criterion.suggested = true;
      criterion.status = "niespełnione";
    } else if (criterion.suggested) {
      // Cofamy tylko status zaproponowany przez generator, nigdy ocenę wpisaną przez audytora.
      criterion.status = "niebadane";
      criterion.suggested = false;
    }
  }
}

export function criteriaStats(report) {
  const counts = Object.fromEntries(CRITERION_STATUSES.map((status) => [status, 0]));
  for (const item of report.criteriaResults || []) counts[item.status] = (counts[item.status] || 0) + 1;
  const total = (report.criteriaResults || []).length;
  const applicable = total - counts["nie dotyczy"];
  const decided = counts["spełnione"] + counts["niespełnione"];
  return {
    counts,
    total,
    applicable,
    // Procent liczymy tylko wtedy, gdy każde mające zastosowanie kryterium ma rozstrzygniętą ocenę.
    percentPassed: applicable > 0 && decided === applicable ? Math.round((counts["spełnione"] / applicable) * 1000) / 10 : null,
  };
}

export function severityCounts(report) {
  return Object.fromEntries(SEVERITIES.map((severity) => [severity, (report.issues || []).filter((issue) => issue.severity === severity).length]));
}

export function validateProject(report) {
  const issues = [];
  const add = (path, message, severity = "error") => issues.push({ path, message, severity });
  const meta = report.meta || {};
  const required = [
    ["meta.reportTitle", meta.reportTitle, "Tytuł raportu jest wymagany."],
    ["meta.auditedEntity", meta.auditedEntity, "Nazwa podmiotu jest wymagana."],
    ["meta.websiteUrl", meta.websiteUrl, "Adres badanej strony jest wymagany."],
    ["meta.auditDate", meta.auditDate, "Data audytu jest wymagana."],
  ];
  for (const [path, value, message] of required) {
    if (!String(value || "").trim()) add(path, message);
  }
  const url = String(meta.websiteUrl || "").trim();
  if (url && !isHttpUrl(url)) add("meta.websiteUrl", "Podaj pełny adres zaczynający się od http:// lub https://.");
  if (!(report.testedViews || []).length) add("testedViews", "Dodaj co najmniej jeden badany widok.");

  const viewIds = new Set((report.testedViews || []).map((view) => view.id));
  const validCriteria = new Set((report.criteriaResults || []).map((item) => item.criterionId));
  (report.issues || []).forEach((issue, index) => {
    const prefix = `issues.${index}`;
    const name = issue.title || `nr ${index + 1}`;
    if (!String(issue.title || "").trim()) add(`${prefix}.title`, `Problem nr ${index + 1} wymaga tytułu.`);
    const id = String(issue.id || "").trim();
    if (id && (report.issues || []).findIndex((other) => String(other.id || "").trim() === id) !== index) add(`${prefix}.id`, `Identyfikator ${id} jest już użyty przy innym problemie: ${name}.`);
    if (!(issue.viewIds || []).length || !(issue.viewIds || []).every((id) => viewIds.has(id))) add(`${prefix}.viewId`, `Wskaż widok, w którym występuje problem: ${name}.`);
    if (issue.issueType === "błąd") {
      if (!(issue.criteria || []).length) add(`${prefix}.criteria`, `Problem typu błąd wymaga kryterium WCAG: ${name}.`);
      for (const [field, label] of [["description", "opisu"], ["userImpact", "opisu wpływu na użytkowników"], ["recommendation", "rekomendacji naprawczej"]]) {
        if (!String(issue[field] || "").trim()) add(`${prefix}.${field}`, `Problem typu błąd wymaga ${label}: ${name}.`);
      }
    }
    if ((issue.criteria || []).some((id) => !validCriteria.has(id))) {
      add(`${prefix}.criteria`, `Problem zawiera kryterium spoza wybranego standardu lub poziomu: ${name}.`);
    }
    (issue.codeExamples || []).forEach((code, codeIndex) => {
      if (!String(code.label || "").trim() || !String(code.language || "").trim()) {
        add(`${prefix}.codeExamples.${codeIndex}`, `Fragment kodu wymaga etykiety i języka: ${name}.`);
      }
    });
    (issue.images || []).forEach((image, imageIndex) => {
      if (dataUrlSize(image.dataUrl) > MAX_IMAGE_BYTES) add(`${prefix}.images.${imageIndex}.dataUrl`, `Obraz przekracza limit 3 MB: ${name}.`);
    });
    if (issue.source && !issue.confirmed) add(`${prefix}.confirmed`, `Problem zaimportowany automatycznie czeka na potwierdzenie audytora: ${name}.`, "warning");
  });

  if (!String(report.summary?.executiveSummary || "").trim()) add("summary.executiveSummary", "Dodaj streszczenie menedżerskie — to pierwsza sekcja raportu.", "warning");
  const environments = report.environment || [];
  const browsers = new Set([...environments.map((env) => env.browser), ...(report.browsers || []).map((item) => item.name)].map((name) => String(name || "").trim().toLowerCase().replace(/^(google|mozilla|microsoft)\s+/, "").split(/\s+/)[0]).filter(Boolean));
  if (environments.length < 2 || browsers.size < 2) add("environment", "Szablon raportu zaleca co najmniej dwa środowiska testowe (komputer i urządzenie mobilne) oraz dwie różne przeglądarki.", "warning");
  const sample = samplePages(meta);
  if (sample && (report.testedViews || []).length < sample) add("testedViews", `Zadeklarowana próba to ${sample} stron lub widoków, a dodano ${(report.testedViews || []).length}.`, "warning");
  const unconfirmed = (report.criteriaResults || []).filter((item) => item.source && !item.confirmed).length;
  if (unconfirmed) add("criteriaResults", `Liczba kryteriów z oceną zaimportowaną automatycznie, niepotwierdzoną przez audytora: ${unconfirmed}.`, "warning");
  const untested = (report.criteriaResults || []).filter((item) => item.status === "niebadane").length;
  if (untested) add("criteriaResults", `Liczba kryteriów bez oceny („niebadane”): ${untested}.`, "warning");
  return issues;
}

export function isHttpUrl(value) {
  try {
    const parsed = new URL(String(value));
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && Boolean(parsed.host);
  } catch {
    return false;
  }
}

export function dataUrlSize(dataUrl) {
  if (typeof dataUrl !== "string" || !dataUrl.includes(",")) return 0;
  return Math.floor((dataUrl.split(",", 2)[1].length * 3) / 4);
}

export function nextId(prefix, collection) {
  const numbers = collection.map((item) => Number(String(item.id || "").match(/(\d+)$/)?.[1] || 0));
  return `${prefix}-${String(Math.max(0, ...numbers) + 1).padStart(3, "0")}`;
}

export function randomId() {
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Mapa: wymaganie → lista indeksów problemów, które go dotyczą.
export function issuesByCriterion(report) {
  const map = new Map();
  (report.issues || []).forEach((issue, index) => {
    for (const id of issue.criteria || []) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(index);
    }
  });
  return map;
}

export function requirementLabel(report, id) {
  const item = (report.criteriaResults || []).find((row) => row.criterionId === id);
  return item ? `${item.displayId || item.criterionId} ${item.title}` : id;
}

// Mapa: widok → indeksy problemów, które w nim występują.
export function issuesByView(report) {
  const map = new Map();
  (report.issues || []).forEach((issue, index) => {
    for (const id of issue.viewIds || []) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(index);
    }
  });
  return map;
}

export const BROWSER_PRESETS = ["Google Chrome", "Mozilla Firefox", "Opera", "Safari", "Microsoft Edge", "Brave"];
export const SCREEN_READER_PRESETS = ["NVDA", "JAWS", "Narrator", "VoiceOver (macOS)", "VoiceOver (iPhone, iOS)", "TalkBack (Android)"];
export const OTHER_AT_PRESETS = ["ZoomText", "Lupa systemowa", "Sterowanie głosowe (Voice Control, Dragon)", "Monitor brajlowski"];

// „NVDA 2025.3” albo samo „NVDA”, gdy wersji nie podano.
export function withVersion(item) {
  const version = String(item?.version || "").trim();
  return version ? `${item.name} ${version}` : String(item?.name || "");
}

export const AUDIT_STATUSES = ["w toku", "do przeglądu", "przekazany klientowi", "audyt ponowny", "zamknięty"];

// Sygnatura wewnętrzna audytu: WCAG/RRRR/NNN, kolejny numer w danym roku. Nie trafia do raportu.
export function nextSignature(signatures, year = new Date().getFullYear()) {
  const prefix = `WCAG/${year}/`;
  const numbers = signatures.filter((sig) => String(sig || "").startsWith(prefix)).map((sig) => Number(String(sig).slice(prefix.length)) || 0);
  return `${prefix}${String(Math.max(0, ...numbers) + 1).padStart(3, "0")}`;
}
