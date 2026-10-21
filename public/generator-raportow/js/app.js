// Interfejs generatora. Cały stan żyje w przeglądarce; nic nie jest wysyłane na serwer.

import { FRAMEWORKS, extraGroupsFor, frameworkOf, legalBasisSuggestions, scopeLabel, versionOf } from "./frameworks.js";
import { HOW_TO_CHECK } from "./hints.js";
import { FIELD_HINTS, ISSUE_BLOCKS, SEVERITY_HINT, blockById, blocksForCriteria, searchBlocks } from "./library.js";
import { ENVIRONMENT_PRESETS, SUGGESTIONS, matchesQuery } from "./suggestions.js";
import { importFiles } from "./import.js";
import {
  CRITERION_STATUSES, COMPACT_IMAGE_BYTES, ISSUE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_SIDE, REAUDIT_STATUSES, SEVERITIES, VIEW_TYPES,
  criteriaStats, dataUrlSize, defaultProject, migrateProject, reportDateOf, todayLocal, newIssue, nextId, randomId, refreshCriteria,
  AUDIT_STATUSES, BROWSER_PRESETS, OTHER_AT_PRESETS, SAMPLE_SIZES, SCREEN_READER_PRESETS, environmentLabel, nextSignature, withVersion, issuesByCriterion, requirementLabel, samplePages, severityCounts, suggestCriterionStatuses, validateProject,
} from "./model.js";
import { renderReportDocx, DOCX_MIME } from "./render-docx.js";
import { renderReportHtml } from "./render-html.js";
import { draftExecutiveSummary } from "./document.js";
import { renderReportMarkdown } from "./render-md.js";
import { currentAuditId, deleteAudit as removeAuditRecord, dropLegacyProject, isPersistent, listAudits, saveAudit, savePending, setCurrentAuditId, takeLegacyProject, takePending } from "./storage.js";
import { escapeHtml, fileBaseName, formatPeriod } from "./text.js";

const STEPS = ["meta", "views", "tools", "issues", "criteria", "summary", "preview"];
const TRASH_ICON = '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2zm-3 6h12l-1 12H7L6 9zm4 2v8h2v-8h-2zm4 0v8h2v-8h-2z"/></svg>';

const state = { report: null, auditId: null, audits: [], step: 0, issueView: "problems", currentIssue: 0, validation: [], showErrors: false, saveTimer: 0, validateTimer: 0 };
const $ = (id) => document.getElementById(id);
const form = $("generator-form");
const attr = (value) => escapeHtml(value).replace(/\r?\n/g, " ");
const lines = (value) => String(value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const options = (values, selected, labels = {}) => values.map((value) => `<option value="${attr(value)}"${value === selected ? " selected" : ""}>${escapeHtml(labels[value] ?? (value || "nie określono"))}</option>`).join("");

init();

// Pola tekstowe rosną razem z treścią — nic nie chowa się za przewijaniem.
// Przeglądarki bez field-sizing: content dostają dopasowanie wysokości w skrypcie.
const AUTO_SIZE = !CSS.supports?.("field-sizing", "content");
function fitTextareas(root = document) {
  if (!AUTO_SIZE) return;
  root.querySelectorAll("textarea").forEach((area) => {
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight + 4}px`;
  });
}
new MutationObserver(() => fitTextareas()).observe(document.body, { childList: true, subtree: true });
document.addEventListener("input", (event) => { if (event.target instanceof HTMLTextAreaElement) fitTextareas(event.target.parentElement); });

// Lista problemów nie przerysowuje się, gdy wciśnięty jest przycisk myszy (kliknięcie by przepadło).
let pointerDown = false;
document.addEventListener("pointerdown", () => { pointerDown = true; }, true);
document.addEventListener("pointerup", () => { setTimeout(() => { pointerDown = false; }, 0); }, true);

async function init() {
  bindEvents();
  bindImageDrop();
  bindToggletips();
  await loadRegister();
  hydrateFields();
  showStep(0, false);
  validateNow();
}

// ── rejestr audytów i zapis ───────────────────────────────────────────────────

async function loadRegister() {
  let audits = [];
  try { audits = await listAudits(); } catch { audits = []; }
  // Projekt z wcześniejszej wersji generatora (jeden projekt w localStorage) trafia do rejestru.
  const legacy = takeLegacyProject();
  if (legacy) {
    try {
      const project = migrateProject(legacy);
      if (!project.meta.signature) project.meta.signature = nextSignature(audits.map((item) => item.project.meta.signature));
      const record = { id: randomId(), project, updatedAt: Date.now() };
      await saveAudit(record);
      audits.push(record);
      dropLegacyProject();
    } catch { /* uszkodzony projekt zostaje w localStorage */ }
  }
  const pending = takePending();
  if (pending?.id && pending.project) {
    const known = audits.find((item) => item.id === pending.id);
    if (!known || known.updatedAt < pending.updatedAt) {
      audits = [...audits.filter((item) => item.id !== pending.id), pending];
      try { await saveAudit(pending); } catch { /* zostaje w pamięci tej sesji */ }
    }
  }
  state.audits = audits.map((record) => ({ ...record, project: migrateProject(record.project) }));
  const wanted = state.audits.find((item) => item.id === currentAuditId()) || [...state.audits].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  if (wanted) activate(wanted);
  else await createAudit(defaultProject(), { silent: true });
}

function activate(record) {
  state.auditId = record.id;
  state.report = record.project;
  state.currentIssue = 0;
  state.showErrors = false;
  setCurrentAuditId(record.id);
  renderCurrentAudit();
}

async function createAudit(project, { silent = false } = {}) {
  const signatures = state.audits.map((item) => item.project.meta.signature);
  if (!project.meta.signature || signatures.includes(project.meta.signature)) project.meta.signature = nextSignature(signatures);
  const record = { id: randomId(), project, updatedAt: Date.now() };
  state.audits.push(record);
  activate(record);
  await persist();
  if (!silent) announce(`Utworzono audyt ${project.meta.signature}.`);
  return record;
}

// Zamknięcie lub schowanie karty zapisuje od razu — bez czekania na opóźniony zapis.
function flushSave() {
  if (!state.saveTimer) return;
  clearTimeout(state.saveTimer);
  state.saveTimer = 0;
  savePending({ id: state.auditId, project: state.report, updatedAt: Date.now() });
  persist();
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushSave(); });
window.addEventListener("pagehide", flushSave);

function scheduleSave() {
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(() => { state.saveTimer = 0; persist(); }, 400);
}

async function persist() {
  const record = state.audits.find((item) => item.id === state.auditId);
  if (!record) return;
  record.project = state.report;
  record.updatedAt = Date.now();
  try {
    await saveAudit(record);
    $("autosave-state").textContent = isPersistent() ? "Audyt zapisany w tej przeglądarce." : "Przeglądarka nie pozwala na trwały zapis — zapisz projekt do pliku JSON przed zamknięciem karty.";
  } catch {
    $("autosave-state").textContent = "Nie udało się zapisać audytu w przeglądarce. Zapisz projekt do pliku JSON.";
  }
  renderCurrentAudit();
  if (!$("register").hidden) renderRegister();
}

function renderCurrentAudit() {
  const meta = state.report.meta;
  $("current-audit").innerHTML = `<span class="current-audit__sig">${escapeHtml(meta.signature || "bez sygnatury")}</span> ${escapeHtml(meta.auditedEntity || "Nowy audyt — uzupełnij dane w kroku 1")}${meta.websiteUrl ? ` <span class="muted">· ${escapeHtml(meta.websiteUrl)}</span>` : ""} <span class="muted">· ${escapeHtml(meta.auditStatus || "w toku")}</span>`;
  $("toggle-register").textContent = `Rejestr audytów (${state.audits.length})`;
}

function toggleRegister(show = $("register").hidden) {
  $("register").hidden = !show;
  $("toggle-register").setAttribute("aria-expanded", String(show));
  document.querySelector(".app-shell").hidden = show;
  if (show) { renderRegister(); $("register-heading").focus(); }
  else document.querySelector(`[data-section="${STEPS[state.step]}"] h2`)?.focus();
}

function renderRegister() {
  const query = fold($("register-filter").value.trim());
  const items = [...state.audits]
    .sort((a, b) => String(b.project.meta.signature).localeCompare(String(a.project.meta.signature), "pl", { numeric: true }))
    .filter(({ project }) => !query || fold([project.meta.signature, project.meta.auditedEntity, project.meta.websiteUrl, project.meta.auditStatus].join(" ")).includes(query));
  $("register-storage").textContent = isPersistent()
    ? "Audyty są zapisane w bazie tej przeglądarki na tym komputerze. Nie trafiają na żaden serwer. Kopię zapasową zrobisz przyciskiem „Zapisz projekt (JSON)”."
    : "Ta przeglądarka nie pozwala na trwały zapis — audyty znikną po zamknięciu karty. Zapisuj projekty do plików JSON.";
  $("register-count").textContent = `Audytów: ${items.length}${query ? ` (z ${state.audits.length})` : ""}.`;
  $("register-list").innerHTML = items.map(({ id, project, updatedAt }) => {
    const meta = project.meta;
    const current = id === state.auditId;
    const label = `${meta.signature} ${meta.auditedEntity || "bez nazwy"}`;
    return `<li class="register-item${current ? " is-current" : ""}">
      <h3 class="register-item__title"><span class="current-audit__sig">${escapeHtml(meta.signature || "—")}</span> ${escapeHtml(meta.auditedEntity || "Audyt bez nazwy podmiotu")}${current ? ' <span class="badge">otwarty</span>' : ""}</h3>
      <p class="register-item__meta">${escapeHtml(meta.websiteUrl || "brak adresu")} · badanie: ${escapeHtml(formatPeriod(meta) === "Nie podano" ? "nie podano" : formatPeriod(meta))} · problemy: ${project.issues.length} · zmiana: ${escapeHtml(new Date(updatedAt).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" }))}</p>
      <div class="register-item__actions">
        <div class="field field--inline"><label for="status-${id}">Stan<span class="visually-hidden">: ${escapeHtml(label)}</span></label><select id="status-${id}" data-register-status="${id}">${options(AUDIT_STATUSES, meta.auditStatus || "w toku")}</select></div>
        ${current ? "" : `<button class="button button--small" type="button" data-register="open" data-id="${id}">Otwórz<span class="visually-hidden"> ${escapeHtml(label)}</span></button>`}
        <button class="button button--small button--secondary" type="button" data-register="duplicate" data-id="${id}">Duplikuj<span class="visually-hidden"> ${escapeHtml(label)}</span></button>
        <button class="button button--small button--danger" type="button" data-register="delete" data-id="${id}">${TRASH_ICON}Usuń<span class="visually-hidden"> ${escapeHtml(label)}</span></button>
      </div>
    </li>`;
  }).join("") || '<li class="empty">Brak audytów pasujących do wyszukiwania.</li>';
}

async function onRegisterClick(event) {
  const button = event.target.closest("button[data-register]");
  if (!button) return;
  const record = state.audits.find((item) => item.id === button.dataset.id);
  if (!record) return;
  const action = button.dataset.register;
  if (action === "open") {
    await persist();
    activate(record);
    hydrateFields();
    validateNow();
    toggleRegister(false);
    showStep(0);
    announce(`Otwarto audyt ${record.project.meta.signature}.`);
  } else if (action === "duplicate") {
    const copy = structuredClone(record.project);
    copy.meta.signature = "";
    copy.meta.auditStatus = "w toku";
    copy.issues.forEach((issue) => { issue.reauditStatus = issue.reauditStatus || ""; });
    await persist();
    await createAudit(copy, { silent: true });
    hydrateFields();
    validateNow();
    renderRegister();
    $("register-heading").focus();
    announce(`Utworzono kopię jako ${copy.meta.signature} i otwarto ją. Przyda się np. do audytu ponownego.`);
  } else if (action === "delete") {
    const label = `${record.project.meta.signature} ${record.project.meta.auditedEntity || ""}`.trim();
    if (!window.confirm(`Usunąć audyt ${label} z tej przeglądarki? Tej operacji nie można cofnąć. Jeśli chcesz go zachować, najpierw otwórz go i zapisz projekt do pliku JSON.`)) return;
    await removeAuditRecord(record.id);
    state.audits = state.audits.filter((item) => item.id !== record.id);
    if (record.id === state.auditId) {
      const next = [...state.audits].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (next) activate(next); else await createAudit(defaultProject(), { silent: true });
      hydrateFields();
      validateNow();
    }
    renderRegister();
    renderCurrentAudit();
    $("register-heading").focus();
    announce(`Usunięto audyt ${label}.`);
  }
}

async function newAudit() {
  await persist();
  await createAudit(defaultProject(), { silent: true });
  hydrateFields();
  validateNow();
  if (!$("register").hidden) toggleRegister(false);
  showStep(0);
  announce(`Utworzono nowy audyt ${state.report.meta.signature}. Poprzednie są w rejestrze.`);
}

function changed({ validate = true } = {}) {
  scheduleSave();
  if (validate) scheduleValidation();
  updateMetrics();
}

// ── zdarzenia ─────────────────────────────────────────────────────────────────

function bindEvents() {
  document.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => showStep(STEPS.indexOf(button.dataset.step))));
  $("previous-step").addEventListener("click", () => showStep(state.step - 1));
  $("next-step").addEventListener("click", () => showStep(state.step + 1));
  form.addEventListener("input", onField);
  form.addEventListener("change", onField);
  form.addEventListener("click", onAction);
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("keydown", (event) => {
    const field = event.target;
    if (event.key === "Escape" && dismissSuggest(field)) { event.preventDefault(); return; }
    if ((event.key === "Backspace" || event.key === "Delete") && field.dataset?.piece !== undefined) { event.preventDefault(); removePiece(field); return; }
    if (event.key === "Enter" && /^tech-/.test(field.dataset?.suggest || "")) {
      event.preventDefault();
      const first = suggestionsFor(field).items[0];
      if (first) addTech(field.dataset.suggest.slice(5), first.value);
      return;
    }
    if (event.key !== "Enter" || field.dataset?.criteriaSearch === undefined) return;
    event.preventDefault();
    const i = Number(field.dataset.issue);
    const issue = state.report.issues[i];
    const valid = new Set(state.report.criteriaResults.map((item) => item.criterionId));
    const exact = parseCriteria(field.value).filter((id) => valid.has(id));
    const matches = matchCriteria(field.value);
    const ids = exact.length ? exact : matches.length === 1 ? [matches[0].criterionId] : [];
    if (!ids.length) { announce(matches.length ? "Pasuje kilka kryteriów — zaznacz je na liście albo wpisz pełny numer." : "Brak pasującego kryterium.", !matches.length); return; }
    const added = ids.filter((id) => !issue.criteria.includes(id));
    issue.criteria.push(...added);
    field.value = "";
    criteriaChanged(i);
    renderCriteriaResults(i);
    announce(added.length ? `Dodano: ${added.map((id) => requirementLabel(state.report, id)).join("; ")}.` : "To kryterium jest już przypisane.");
  });
  $("error-list").addEventListener("click", onErrorLink);
  $("open-files").addEventListener("click", () => $("import-files").click());
  $("import-files").addEventListener("change", onImport);
  $("download-json").addEventListener("click", downloadProject);
  $("new-audit").addEventListener("click", newAudit);
  $("toggle-register").addEventListener("click", () => toggleRegister());
  $("register-list").addEventListener("click", onRegisterClick);
  $("register-list").addEventListener("change", (event) => {
    const id = event.target.dataset.registerStatus;
    const record = state.audits.find((item) => item.id === id);
    if (!record) return;
    record.project.meta.auditStatus = event.target.value;
    if (id === state.auditId) state.report.meta.auditStatus = event.target.value;
    saveAudit({ ...record, updatedAt: Date.now() });
    renderCurrentAudit();
    announce(`Stan audytu ${record.project.meta.signature}: ${event.target.value}.`);
  });
  $("register-filter").addEventListener("input", renderRegister);
  $("add-view").addEventListener("click", addView);
  $("add-environment").addEventListener("click", addEnvironment);
  $("toggle-issue-editor").addEventListener("click", () => {
    const open = $("toggle-issue-editor").getAttribute("aria-expanded") !== "true";
    setIssueEditor(open);
    announce(open ? "Rozwinięto formularz problemu." : "Zwinięto formularz problemu.");
  });
  $("add-issue").addEventListener("click", addIssue);
  form.addEventListener("focusin", onSuggestFocus);
  form.addEventListener("focusout", onSuggestBlur);
  form.addEventListener("input", onSuggestInput);
  form.addEventListener("keyup", (event) => { if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) && event.target.dataset?.suggest) renderSuggest(event.target); });
  $("confirm-imported").addEventListener("click", confirmImportedCriteria);
  $("criteria-filter").addEventListener("change", renderCriteria);
  ["filter-view", "filter-severity", "filter-criterion", "filter-confirmed"].forEach((id) => $(id).addEventListener("change", renderIssues));
  document.querySelectorAll("[data-export]").forEach((button) => button.addEventListener("click", () => exportReport(button.dataset.export)));
}

function onField(event) {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
  if (field.type === "file") return;
  const report = state.report;
  const d = field.dataset;
  const value = field.type === "checkbox" ? field.checked : field.value;
  if (onScopeField(field)) return changed();
  if (d.viewToggle !== undefined || d.envToggle !== undefined || d.envAll !== undefined) {
    if (event.type !== "change") return;
    const i = Number(d.issue);
    const issue = state.report.issues[i];
    if (d.viewToggle !== undefined) {
      issue.viewIds = field.checked ? [...new Set([...issue.viewIds, d.viewToggle])] : issue.viewIds.filter((id) => id !== d.viewToggle);
      issue.viewIds = state.report.testedViews.map((view) => view.id).filter((id) => issue.viewIds.includes(id));
      issue.viewId = issue.viewIds[0] || "";
    } else if (d.envAll !== undefined) {
      issue.environmentIds = field.checked ? [] : state.report.environment.map((env) => env.id);
      $(`issue-${i}-env-list`).hidden = field.checked;
      $(`issue-${i}-env-list`).querySelectorAll("input").forEach((input) => { input.checked = !field.checked; });
      announce(field.checked ? "Problem dotyczy wszystkich środowisk." : "Odznacz środowiska, w których problem nie wystąpił.");
    } else {
      const set = new Set(issue.environmentIds);
      if (field.checked) set.add(d.envToggle); else set.delete(d.envToggle);
      issue.environmentIds = state.report.environment.map((env) => env.id).filter((id) => set.has(id));
    }
    return changed();
  }
  if (d.techToggle !== undefined || d.techVersion !== undefined) {
    const list = d.kind === "browser" ? state.report.browsers : state.report.assistiveTech;
    let item = techEntries(d.kind).find((entry) => entry.name === d.name);
    if (d.techToggle !== undefined) {
      if (event.type !== "change") return;
      if (field.checked && !item) list.push({ id: randomId(), name: d.name, version: $(`${field.id}-version`)?.value.trim() || "", ...(d.kind === "browser" ? {} : { kind: d.kind }) });
      if (!field.checked && item) list.splice(list.indexOf(item), 1);
    } else {
      if (!item && field.value.trim()) {
        item = { id: randomId(), name: d.name, version: "", ...(d.kind === "browser" ? {} : { kind: d.kind }) };
        list.push(item);
        const box = $(field.id.replace(/-version$/, ""));
        if (box) box.checked = true;
      }
      if (item) item.version = field.value.trim();
    }
    return changed();
  }
  if (d.sampleNumber !== undefined) {
    // Liczba decyduje: 5/10/20 zaznacza wariant, inna wartość — „własna”.
    const value = Math.round(Number(field.value));
    const meta = state.report.meta;
    if (field.value === "" || !(value > 0)) { meta.sampleSizeCustom = null; meta.sampleSize = meta.sampleSize === "wlasny" ? "wlasny" : ""; }
    else {
      meta.sampleSizeCustom = value;
      meta.sampleSize = Object.keys(SAMPLE_SIZES).find((key) => SAMPLE_SIZES[key].pages === value) || "wlasny";
    }
    renderSample({ keepNumber: true });
    return changed();
  }
  if (d.criteriaSearch !== undefined) { if (event.type === "input") renderCriteriaResults(Number(d.issue)); return; }
  if (d.criterionToggle !== undefined) {
    if (event.type !== "change") return;
    const i = Number(d.issue);
    const list = state.report.issues[i].criteria;
    const id = d.criterionToggle;
    if (field.checked && !list.includes(id)) list.push(id);
    if (!field.checked) list.splice(list.indexOf(id), 1);
    criteriaChanged(i);
    announce(`${field.checked ? "Dodano" : "Usunięto"} kryterium ${requirementLabel(state.report, id)}. Przypisanych: ${list.length}.`);
    return;
  }

  if (d.meta) {
    report.meta[d.meta] = value;
    if (d.meta === "sector") { refreshCriteria(report); renderScope(); }
    if (["signature", "auditStatus", "auditedEntity", "websiteUrl"].includes(d.meta)) renderCurrentAudit();
  } else if (d.metaList) report.meta[d.metaList] = lines(value);
  else if (d.toolList) report.tools[d.toolList] = lines(value);
  else if (d.summary) report.summary[d.summary] = value;
  else if (d.reportDate !== undefined) {
    // Puste pole wraca do daty automatycznej (dzisiejszej).
    report.summary.reportCreatedAt = value;
    report.summary.reportCreatedAtManual = Boolean(value) && value !== todayLocal();
    if (!value && event.type === "change") field.value = reportDateOf(report);
  }
  else if (d.summaryList) report.summary[d.summaryList] = lines(value);
  else if (d.summaryNumber) report.summary[d.summaryNumber] = value === "" ? null : Number(value);
  else if (d.view !== undefined) {
    const view = report.testedViews[Number(d.view)];
    if (!view) return;
    view[d.field] = value;
    if (d.field === "name") updateCardHeading(field, `Widok ${Number(d.view) + 1}: ${value || "bez nazwy"}`);
  } else if (d.environment !== undefined) {
    const item = report.environment[Number(d.environment)];
    if (item) item[d.field] = value;
  } else if (d.criterion !== undefined) {
    const item = report.criteriaResults[Number(d.criterion)];
    if (!item) return;
    item[d.field] = value;
    if (d.field === "status") {
      Object.assign(item, { manualOverride: true, confirmed: true, suggested: false, autoFilled: false });
      updateCriterionNote(Number(d.criterion));
    }
  } else if (d.issue !== undefined) {
    onIssueField(field, event.type, value);
  } else return;

  changed();
}

// Kreator zakresu: standard → wersja → poziom → wymagania dodatkowe.
function onScopeField(field) {
  const meta = state.report.meta;
  const name = field.name;
  if (!["framework", "framework-version", "level", "extra-group", "issue-view", "report-grouping"].includes(name)) return false;
  if (name === "issue-view") { state.issueView = field.value; renderIssues(); return true; }
  if (name === "report-grouping") { meta.reportGrouping = field.value; return true; }
  if (name === "framework") { meta.framework = field.value; meta.frameworkVersion = FRAMEWORKS[field.value].defaultVersion; meta.extraGroups = []; }
  if (name === "framework-version") meta.frameworkVersion = field.value;
  if (name === "level") meta.conformanceLevel = field.value;
  if (name === "extra-group") {
    const set = new Set(meta.extraGroups || []);
    if (field.checked) set.add(field.value); else set.delete(field.value);
    meta.extraGroups = [...set];
  }
  refreshCriteria(state.report);
  renderScope(field.id);
  announce(`Zakres: ${scopeLabel(meta)}. Lista wymagań: ${state.report.criteriaResults.length}.`);
  return true;
}

function radio(name, value, label, hint, checked, disabled = false) {
  const id = `${name}-${value.replace(/[^a-z0-9]/gi, "-")}`;
  return `<div class="choice choice--card${disabled ? " is-disabled" : ""}"><input type="radio" id="${id}" name="${name}" value="${attr(value)}"${checked ? " checked" : ""}${disabled ? " disabled" : ""}${hint ? ` aria-describedby="${id}-hint"` : ""}><label for="${id}">${escapeHtml(label)}</label>${hint ? `<p class="choice-hint" id="${id}-hint">${escapeHtml(hint)}</p>` : ""}</div>`;
}

function renderScope(focusId) {
  const meta = state.report.meta;
  const framework = frameworkOf(meta);
  $("framework-choices").innerHTML = Object.entries(FRAMEWORKS).map(([key, item]) => radio("framework", key, `${item.label} — ${item.long}`, item.hint, key === meta.framework)).join("");
  $("version-legend").textContent = `Wersja ${framework.label}`;
  $("version-choices").innerHTML = Object.entries(framework.versions).map(([key, item]) => radio("framework-version", key, item.label, item.hint, key === meta.frameworkVersion, item.disabled)).join("");
  $("level-choices").innerHTML = framework.fixedLevel ? "" : framework.levels.map((level) => radio("level", level, `Poziom ${level}`, { A: "Tylko kryteria poziomu A.", AA: "Kryteria A i AA — poziom wymagany przez przepisy.", AAA: "Wszystkie kryteria; zwykle tylko dla wybranych treści." }[level], level === meta.conformanceLevel)).join("");
  $("level-note").textContent = framework.fixedLevel ? `${framework.levelNote} Poziomu nie trzeba wybierać.` : "";
  const extras = extraGroupsFor(meta);
  const keys = Object.keys(extras);
  $("extras-group").hidden = keys.length === 0;
  $("extras-choices").innerHTML = keys.map((key) => {
    const group = extras[key];
    const locked = meta.framework === "bitv" && key === "bitv";
    return `<div class="choice choice--card"><input type="checkbox" id="extra-${key}" name="extra-group" value="${key}"${(meta.extraGroups || []).includes(key) ? " checked" : ""}${locked ? " disabled" : ""} aria-describedby="extra-${key}-hint"><label for="extra-${key}">${escapeHtml(group.label)} (${group.items.length})</label><p class="choice-hint" id="extra-${key}-hint">${escapeHtml(group.hint)}${locked ? " Obowiązkowe dla BITV." : ""}</p></div>`;
  }).join("");
  $("scope-summary").textContent = `Raport obejmie: ${scopeLabel(meta)} — ${state.report.criteriaResults.length} wymagań.`;
  // Fokus wraca dokładnie na pole, którego użyto (po przerysowaniu ma ten sam identyfikator).
  if (focusId) $(focusId)?.focus();
}


function onIssueField(field, eventType, value) {
  const index = Number(field.dataset.issue);
  const issue = state.report.issues[index];
  if (!issue) return;
  const key = field.dataset.field;
  if (field.dataset.code !== undefined) {
    const code = issue.codeExamples[Number(field.dataset.code)];
    if (code) code[key] = value;
    return;
  }
  if (field.dataset.image !== undefined) {
    const imageIndex = Number(field.dataset.image);
    const image = issue.images[imageIndex];
    if (!image) return;
    image[key] = value;
    if (key === "alt") image.isDecorative = !String(value).trim();
    return;
  }
  if (key === "stepsToReproduce") issue.stepsToReproduce = lines(value);
  else issue[key] = value;
  if (key === "issueType") suggestCriterionStatuses(state.report);
  // Pola tekstowe odświeżają listę przy pisaniu (input), nie przy opuszczeniu pola (change): przerysowanie
  // listy w chwili kliknięcia innego problemu zjadało to kliknięcie.
  const live = eventType === "input" || field.tagName === "SELECT" || field.type === "checkbox";
  if (live && ["id", "title", "severity", "confirmed", "shortName"].includes(key)) { updateCardHeading(field, issueSummary(issue, index)); renderIssueNav(); }
}

function onAction(event) {
  const pick = event.target.closest("button[data-suggest-pick], button[data-suggest-all]");
  if (pick) return pickSuggestion(pick);
  const piece = event.target.closest("button[data-piece]");
  if (piece) return removePiece(piece);
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const report = state.report;
  const d = button.dataset;
  const index = Number(d.index);
  switch (d.action) {
    case "sample-size": {
      const meta = report.meta;
      meta.sampleSize = d.value;
      const preset = SAMPLE_SIZES[d.value].pages;
      meta.sampleSizeCustom = preset ?? meta.sampleSizeCustom ?? null;
      renderSample();
      if (preset) {
        $(`sample-size-${d.value}`)?.focus();
        announce(`Wybrano: ${SAMPLE_SIZES[d.value].label.toLowerCase()}, ${preset} stron.`);
      } else {
        $("sample-custom").focus();
        announce("Wybrano własną wielkość próby. Wpisz liczbę stron lub widoków.");
      }
      break;
    }
    case "remove-view": {
      const [removed] = report.testedViews.splice(index, 1);
      report.issues.forEach((issue) => { issue.viewIds = issue.viewIds.filter((id) => id !== removed?.id); issue.viewId = issue.viewIds[0] || ""; });
      rerender(renderViews, "#add-view");
      renderSample();
      announce(`Usunięto widok: ${removed?.name || "bez nazwy"}.`);
      break;
    }
    case "move-view":
      move(report.testedViews, index, Number(d.dir));
      rerender(renderViews, [`[data-action="move-view"][data-index="${index + Number(d.dir)}"][data-dir="${d.dir}"]`, `[data-action="move-view"][data-index="${index + Number(d.dir)}"]`, `#view-${index + Number(d.dir)}-name`]);
      announce(`Przeniesiono widok na pozycję ${index + Number(d.dir) + 1}.`);
      break;
    case "remove-tech": {
      const list = d.kind === "browser" ? report.browsers : report.assistiveTech;
      const item = techEntries(d.kind).find((entry) => entry.name === d.name);
      if (item) list.splice(list.indexOf(item), 1);
      renderTech(d.kind);
      $(`tech-${d.kind}-search`).focus();
      announce(`Usunięto: ${d.name}.`);
      break;
    }
    case "add-environment-preset":
      report.environment.push({ id: randomId(), notes: "", ...ENVIRONMENT_PRESETS[index] });
      rerender(renderEnvironments, `#environment-${report.environment.length - 1}-device`);
      announce(`Dodano środowisko: ${Object.values(ENVIRONMENT_PRESETS[index]).join(", ")}. Zmień wersje programów, jeśli trzeba.`);
      break;
    case "remove-environment": {
      const [gone] = report.environment.splice(index, 1);
      report.issues.forEach((issue) => { issue.environmentIds = issue.environmentIds.filter((id) => id !== gone?.id); });
      rerender(renderEnvironments, "#add-environment");
      announce("Usunięto środowisko testowe.");
      break;
    }
    case "remove-issue": {
      const target = report.issues[index];
      if (!isEmptyIssue(target) && !window.confirm(`Usunąć problem ${index + 1} „${target.title || "bez tytułu"}”? Tego nie da się cofnąć.`)) return;
      const [removed] = report.issues.splice(index, 1);
      suggestCriterionStatuses(report);
      const next = Math.min(index, report.issues.length - 1);
      rerender(renderIssues, next >= 0 && d.place === "nav" ? `.issue-pick[data-index="${next}"]` : "#add-issue");
      announce(`Usunięto problem: ${removed?.title || "bez tytułu"}.`);
      break;
    }
    case "duplicate-issue": {
      const copy = structuredClone(report.issues[index]);
      copy.id = nextId("A11Y", report.issues);
      copy.title = `${copy.title || "Problem"} (kopia)`;
      copy.source = "";
      copy.confirmed = true;
      report.issues.splice(index + 1, 0, copy);
      rerender(renderIssues, `#issue-${index + 1}-title`, [index + 1]);
      announce("Utworzono kopię problemu.");
      break;
    }
    case "move-issue": {
      const place = d.place ? `[data-place="${d.place}"]` : ":not([data-place])";
      const to = index + Number(d.dir);
      move(report.issues, index, Number(d.dir));
      if (state.currentIssue === index) state.currentIssue = to;
      else if (state.currentIssue === to) state.currentIssue = index;
      rerender(renderIssues, [`[data-action="move-issue"]${place}[data-index="${to}"][data-dir="${d.dir}"]`, `[data-action="move-issue"]${place}[data-index="${to}"]`, d.place ? `.issue-pick[data-index="${to}"]` : `#issue-${to}-editor-heading`], [to]);
      announce(`Przeniesiono problem na pozycję ${to + 1}.`);
      break;
    }
    case "add-code":
      report.issues[index].codeExamples.push({ id: randomId(), label: "", language: "html", code: "" });
      rerender(renderIssues, `#issue-${index}-code-${report.issues[index].codeExamples.length - 1}-label`, [index]);
      announce("Dodano fragment kodu.");
      break;
    case "remove-code":
      report.issues[Number(d.issue)].codeExamples.splice(Number(d.code), 1);
      rerender(renderIssues, `[data-action="add-code"][data-index="${d.issue}"]`, [Number(d.issue)]);
      announce("Usunięto fragment kodu.");
      break;
    case "move-image": {
      const target = Number(d.image) + Number(d.dir);
      move(report.issues[Number(d.issue)].images, Number(d.image), Number(d.dir));
      rerender(renderIssues, [`[data-action="move-image"][data-issue="${d.issue}"][data-image="${target}"][data-dir="${d.dir}"]`, `[data-action="move-image"][data-issue="${d.issue}"][data-image="${target}"]`, `#issue-${d.issue}-image-${target}-alt`], [Number(d.issue)]);
      announce(`Przeniesiono obraz na pozycję ${target + 1}.`);
      break;
    }
    case "remove-image":
      report.issues[Number(d.issue)].images.splice(Number(d.image), 1);
      rerender(renderIssues, `#issue-${d.issue}-image-upload`, [Number(d.issue)]);
      announce("Usunięto obraz.");
      break;
    case "remove-criterion": {
      const issue = report.issues[index];
      issue.criteria = issue.criteria.filter((id) => id !== d.id);
      criteriaChanged(index);
      renderCriteriaResults(index);
      $(`issue-${index}-criteria`).focus();
      announce(`Usunięto kryterium ${requirementLabel(report, d.id)}. Przypisanych: ${issue.criteria.length}.`);
      return;
    }
    case "add-all-criteria": {
      const issue = report.issues[index];
      const added = matchCriteria($(`issue-${index}-criteria`).value).map((item) => item.criterionId).filter((id) => !issue.criteria.includes(id));
      issue.criteria.push(...added);
      criteriaChanged(index);
      renderCriteriaResults(index);
      $(`issue-${index}-criteria`).focus();
      announce(`Dodano ${added.length} kryteriów. Przypisanych: ${issue.criteria.length}.`);
      return;
    }
    case "draft-summary": {
      const area = $("executive-summary");
      const draft = draftExecutiveSummary(report);
      report.summary.executiveSummary = area.value.trim() ? `${area.value.trim()}\n\n${draft}` : draft;
      area.value = report.summary.executiveSummary;
      renderPieces(area);
      area.focus();
      announce("Wstawiono szkic streszczenia z danych raportu. Zredaguj go — fragment w nawiasie kwadratowym uzupełnij sam.");
      break;
    }
    case "goto-issue":
      gotoIssue(index);
      return;
    case "select-issue":
      setIssueEditor(true);
      gotoIssue(index, { switchStep: false });
      return;
    case "new-issue":
      addIssue();
      return;
    case "goto-criterion":
      gotoCriterion(d.id);
      return;
    default:
      return;
  }
  changed();
}

function applyBlock(issue, block, replace) {
  const filled = [];
  const set = (key, value, label) => {
    const empty = Array.isArray(issue[key]) ? !issue[key].length : !String(issue[key] || "").trim();
    if (replace || empty) { issue[key] = value; filled.push(label); }
  };
  set("title", block.title, "tytuł");
  set("description", block.description, "opis");
  set("userImpact", block.userImpact, "wpływ na użytkowników");
  const valid = new Set(state.report.criteriaResults.map((item) => item.criterionId));
  const criteria = block.criteria.filter((id) => valid.has(id));
  if (replace || !issue.criteria.length) { issue.criteria = criteria; filled.push("kryteria"); }
  if (replace || issue.severity === "Priorytet 2") { issue.severity = block.severity; filled.push("priorytet"); }
  issue.blockId = block.id;
  return filled;
}

function gotoIssue(index, { switchStep = true } = {}) {
  ["filter-view", "filter-severity", "filter-criterion", "filter-confirmed"].forEach((id) => { $(id).value = ""; });
  state.currentIssue = index;
  if (switchStep && STEPS[state.step] !== "issues") showStep(STEPS.indexOf("issues"), false);
  else renderIssues();
  const heading = $(`issue-${index}-editor-heading`);
  if (!heading) return;
  heading.focus();
  heading.scrollIntoView({ block: "start" });
}

function gotoCriterion(id) {
  $("criteria-filter").value = "";
  showStep(STEPS.indexOf("criteria"), false);
  const index = state.report.criteriaResults.findIndex((item) => item.criterionId === id);
  const target = $(`criterion-${index}-status`);
  if (target) { target.focus(); target.closest("li").scrollIntoView({ block: "center" }); }
}

function move(list, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
}

// Przerysowuje listę bez gubienia fokusu i rozwiniętych kart.
function rerender(render, focusSelector, openIssues = []) {
  if (openIssues.length) state.currentIssue = openIssues[openIssues.length - 1];
  render();
  const target = [].concat(focusSelector || []).map((selector) => document.querySelector(selector)).find((el) => el && !el.disabled);
  if (target) target.focus();
  else if (focusSelector) document.querySelector(`[data-section="${STEPS[state.step]}"] h2`)?.focus();
}

function updateCardHeading(field, textValue) {
  const heading = field.closest("[data-card]")?.querySelector("[data-card-title]");
  if (heading) heading.textContent = textValue;
}

// ── kroki ─────────────────────────────────────────────────────────────────────

function showStep(index, moveFocus = true) {
  state.step = Math.max(0, Math.min(STEPS.length - 1, index));
  const name = STEPS[state.step];
  document.querySelectorAll("[data-section]").forEach((section) => { section.hidden = section.dataset.section !== name; });
  document.querySelectorAll("[data-step]").forEach((button) => {
    if (button.dataset.step === name) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  $("previous-step").hidden = state.step === 0;
  $("next-step").hidden = state.step === STEPS.length - 1;
  if (name === "meta") renderScope();
  if (name === "views") { renderSample(); renderViews(); }
  if (name === "tools") { renderTech(); renderEnvironments(); }
  if (name === "criteria") renderCriteria();
  if (name === "issues") { renderIssueFilters(); renderIssues(); }
  if (name === "summary") updatePercentHelp();
  if (name === "preview") { document.querySelectorAll('input[name="report-grouping"]').forEach((input) => { input.checked = input.value === (state.report.meta.reportGrouping || "problems"); }); state.showErrors = true; validateNow(); refreshPreview(); }
  renderErrorSummary();
  if (moveFocus) document.querySelector(`[data-section="${name}"] h2`)?.focus();
}

function hydrateFields() {
  const { meta, tools, summary } = state.report;
  document.querySelectorAll("[data-meta]").forEach((field) => { field.value = meta[field.dataset.meta] ?? ""; });
  document.querySelectorAll("[data-meta-list]").forEach((field) => { field.value = (meta[field.dataset.metaList] || []).join("\n"); });
  document.querySelectorAll("[data-tool-list]").forEach((field) => { field.value = (tools[field.dataset.toolList] || []).join("\n"); });
  document.querySelectorAll("[data-summary]").forEach((field) => { field.value = summary[field.dataset.summary] ?? ""; });
  document.querySelectorAll("[data-summary-list]").forEach((field) => { field.value = (summary[field.dataset.summaryList] || []).join("\n"); });
  document.querySelectorAll("[data-summary-number]").forEach((field) => { field.value = summary[field.dataset.summaryNumber] ?? ""; });
  $("report-created-at").value = reportDateOf(state.report);
  document.querySelectorAll("[data-suggest]").forEach(renderPieces);
  // Rok najwyżej bieżący: przeglądarka nie pozwoli wybrać późniejszej daty w kalendarzu.
  document.querySelectorAll("[data-date-limit]").forEach((field) => { field.max = `${new Date().getFullYear()}-12-31`; });
  updateMetrics();
}

// ── widoki i środowiska ───────────────────────────────────────────────────────

function renderSample({ keepNumber = false } = {}) {
  const meta = state.report.meta;
  const focused = document.activeElement?.dataset?.action === "sample-size" ? document.activeElement.id : null;
  // Przyciski z aria-pressed: cały kafel jest klikalny, Tab przechodzi po kolejnych wariantach.
  $("sample-choices").innerHTML = Object.entries(SAMPLE_SIZES).map(([key, item]) => `<button type="button" class="choice-button" id="sample-size-${key}" data-action="sample-size" data-value="${key}" aria-pressed="${meta.sampleSize === key}"><span class="choice-button__label">${escapeHtml(item.label)}</span><span class="choice-button__meta">${item.pages ? `${item.pages} stron` : "wpisz liczbę poniżej"}</span></button>`).join("");
  if (focused) $(focused)?.focus();
  if (!keepNumber) $("sample-custom").value = samplePages(meta) ?? "";
  const target = samplePages(meta);
  const have = state.report.testedViews.length;
  $("sample-status").textContent = target ? `Zadeklarowana próba: ${target}. Dodane widoki: ${have}.${have >= target ? " Próba jest kompletna." : ` Brakuje: ${target - have}.`}` : "Wybierz wielkość próby albo zadeklaruj własną.";
}

function addView() {
  state.report.testedViews.push({ id: randomId(), name: "", url: state.report.meta.websiteUrl || "", type: "strona", description: "", isKeyView: false });
  rerender(renderViews, `#view-${state.report.testedViews.length - 1}-name`);
  renderSample();
  announce("Dodano widok. Uzupełnij jego nazwę i adres.");
  changed();
}

function renderViews() {
  const views = state.report.testedViews;
  $("view-list").innerHTML = views.length ? views.map((view, i) => `
    <article class="card" data-card aria-labelledby="view-${i}-heading">
      <h4 id="view-${i}-heading" data-card-title>Widok ${i + 1}: ${escapeHtml(view.name || "bez nazwy")}</h4>
      <div class="form-grid">
        <div class="field"><label for="view-${i}-name">Nazwa widoku</label><input id="view-${i}-name" data-view="${i}" data-field="name" data-suggest="viewNames" autocomplete="off" value="${attr(view.name)}"></div>
        <div class="field"><label for="view-${i}-url">Adres</label><input id="view-${i}-url" type="url" inputmode="url" data-view="${i}" data-field="url" value="${attr(view.url)}"></div>
        <div class="field"><label for="view-${i}-type">Rodzaj</label><select id="view-${i}-type" data-view="${i}" data-field="type">${options(VIEW_TYPES, view.type)}</select></div>
        <div class="field field--check field--tip"><input type="checkbox" id="view-${i}-key" data-view="${i}" data-field="isKeyView" aria-describedby="view-${i}-key-tip"${view.isKeyView ? " checked" : ""}><label for="view-${i}-key">Widok kluczowy</label>${toggletip(`view-${i}-key-tip`, "Co to jest widok kluczowy?", KEY_VIEW_TIP)}</div>
        <div class="field field--wide"><label for="view-${i}-description">Opis</label><textarea id="view-${i}-description" data-view="${i}" data-field="description" rows="2">${escapeHtml(view.description)}</textarea></div>
      </div>
      <div class="card-actions">
        ${i > 0 ? `<button class="button button--small button--secondary" type="button" data-action="move-view" data-index="${i}" data-dir="-1">Przenieś wyżej<span class="visually-hidden">: widok ${i + 1}</span></button>` : ""}
        ${i < views.length - 1 ? `<button class="button button--small button--secondary" type="button" data-action="move-view" data-index="${i}" data-dir="1">Przenieś niżej<span class="visually-hidden">: widok ${i + 1}</span></button>` : ""}
        <button class="button button--small button--danger" type="button" data-action="remove-view" data-index="${i}">${TRASH_ICON}Usuń widok<span class="visually-hidden"> ${i + 1}: ${escapeHtml(view.name || "bez nazwy")}</span></button>
      </div>
    </article>`).join("") : '<p class="empty">Nie dodano jeszcze żadnego widoku.</p>';
  applyFieldErrors();
}

function addEnvironment() {
  state.report.environment.push({ id: randomId(), device: "", operatingSystem: "", browser: "", assistiveTechnology: "", viewport: "", notes: "" });
  rerender(renderEnvironments, `#environment-${state.report.environment.length - 1}-device`);
  announce("Dodano środowisko testowe.");
  changed();
}

// ── przeglądarki i technologie asystujące z wersjami ─────────────────────────

const TECH = {
  browser: { presets: BROWSER_PRESETS, extra: ["Samsung Internet", "Vivaldi", "Chromium", "DuckDuckGo"], add: "Dodaj przeglądarkę", empty: "Nie dodano przeglądarki." },
  reader: { presets: SCREEN_READER_PRESETS, extra: ["Orca (Linux)", "VoiceOver (iPadOS)", "TalkBack (tablet)"], add: "Dodaj czytnik ekranu", empty: "Nie dodano czytnika ekranu." },
  other: { presets: OTHER_AT_PRESETS, extra: ["Lupa macOS", "Tryb wysokiego kontrastu", "Klawiatura ekranowa", "Przełącznik (switch)", "Narzędzie do odczytu tekstu (TTS)"], add: "Dodaj technologię asystującą", empty: "Nie dodano innych technologii asystujących." },
};

function techEntries(kind) {
  return kind === "browser" ? state.report.browsers : state.report.assistiveTech.filter((item) => (item.kind || "other") === kind);
}

function renderTech(kind = null) {
  for (const key of kind ? [kind] : Object.keys(TECH)) {
    const box = $(`tech-${key}`);
    const searchHadFocus = document.activeElement?.id === `tech-${key}-search`;
    const query = $(`tech-${key}-search`)?.value || "";
    const entries = techEntries(key);
    box.innerHTML = `
      ${entries.length ? `<ul class="tech-added">${entries.map((item, k) => `<li>
        <span class="tech-added__name">${escapeHtml(item.name)}</span>
        <span class="tech-added__version"><label for="tech-${key}-${k}-version">Wersja<span class="visually-hidden">: ${escapeHtml(item.name)}</span></label><input id="tech-${key}-${k}-version" data-tech-version data-kind="${key}" data-name="${attr(item.name)}" value="${attr(item.version)}" autocomplete="off"></span>
        <button class="button button--small button--danger" type="button" data-action="remove-tech" data-kind="${key}" data-name="${attr(item.name)}">${TRASH_ICON}Usuń<span class="visually-hidden"> ${escapeHtml(item.name)}</span></button>
      </li>`).join("")}</ul>` : `<p class="muted">${TECH[key].empty}</p>`}
      <div class="field"><label for="tech-${key}-search">${TECH[key].add} — zacznij pisać</label><input type="search" id="tech-${key}-search" data-suggest="tech-${key}" autocomplete="off" value="${attr(query)}"></div>`;
    if (searchHadFocus) $(`tech-${key}-search`).focus();
  }
}

function addTech(kind, name) {
  const list = kind === "browser" ? state.report.browsers : state.report.assistiveTech;
  const clean = String(name || "").trim();
  if (!clean) return;
  if (!techEntries(kind).some((entry) => entry.name.toLowerCase() === clean.toLowerCase())) list.push({ id: randomId(), name: clean, version: "", ...(kind === "browser" ? {} : { kind }) });
  const search = $(`tech-${kind}-search`);
  if (search) search.value = "";
  renderTech(kind);
  $(`tech-${kind}-search`).focus();
  announce(`Dodano: ${clean}. Wersję możesz wpisać obok nazwy.`);
  changed();
}

const PRESET_KEYS = ["device", "operatingSystem", "browser", "assistiveTechnology"];
const samePreset = (preset, env) => PRESET_KEYS.every((key) => fold(preset[key]) === fold(env[key]));

// Gotowe środowiska w tabeli z kolumnami: urządzenie | system | przeglądarka | czytnik. Dodane znikają z tabeli.
function renderEnvironmentPresets() {
  const left = ENVIRONMENT_PRESETS.map((preset, k) => ({ preset, k })).filter(({ preset }) => !state.report.environment.some((env) => samePreset(preset, env)));
  $("environment-presets").innerHTML = left.length ? `
    <div class="table-wrap" tabindex="0" role="region" aria-labelledby="env-presets-caption">
      <table class="preset-table">
        <caption id="env-presets-caption">Gotowe środowiska</caption>
        <thead><tr><th scope="col">Urządzenie</th><th scope="col">System operacyjny</th><th scope="col">Przeglądarka</th><th scope="col">Czytnik lub technologia asystująca</th><th scope="col"><span class="visually-hidden">Akcja</span></th></tr></thead>
        <tbody>${left.map(({ preset, k }) => `<tr>${PRESET_KEYS.map((key) => `<td>${escapeHtml(preset[key])}</td>`).join("")}<td><button class="button button--small button--secondary" type="button" data-action="add-environment-preset" data-index="${k}">Wybierz<span class="visually-hidden">: ${escapeHtml(PRESET_KEYS.map((key) => preset[key]).join(", "))}</span></button></td></tr>`).join("")}</tbody>
      </table>
    </div>` : "";
}

function renderEnvironments() {
  renderEnvironmentPresets();
  const fields = [["device", "Urządzenie", "envDevice"], ["operatingSystem", "System operacyjny", "envOS"], ["browser", "Przeglądarka", "envBrowser"], ["assistiveTechnology", "Technologia asystująca", "envAT"], ["viewport", "Rozdzielczość lub widok", "envViewport"]];
  const items = state.report.environment;
  $("environment-list").innerHTML = items.length ? items.map((item, i) => `
    <article class="card" aria-labelledby="environment-${i}-heading">
      <h4 id="environment-${i}-heading">Środowisko ${i + 1}</h4>
      <div class="form-grid">
        ${fields.map(([key, label, suggest]) => `<div class="field"><label for="environment-${i}-${key}">${label}</label><input id="environment-${i}-${key}" data-environment="${i}" data-field="${key}" data-suggest="${suggest}" autocomplete="off" value="${attr(item[key])}"><p class="field-help">Wpisz albo wybierz z listy.</p></div>`).join("")}
      </div>
      <div class="card-actions"><button class="button button--small button--danger" type="button" data-action="remove-environment" data-index="${i}">${TRASH_ICON}Usuń środowisko ${i + 1}</button></div>
    </article>`).join("") : '<p class="empty">Nie dodano środowiska testowego.</p>';
}

// ── kryteria ──────────────────────────────────────────────────────────────────

function criterionNote(item) {
  if (item.source && !item.confirmed) return "Ocena z importu — czeka na potwierdzenie.";
  if (item.autoFilled) return "Uzupełnione automatycznie (kryterium usunięte w WCAG 2.2).";
  if (item.suggested) return "Zaproponowane na podstawie problemów typu błąd.";
  return "";
}

function renderCriteria() {
  const filter = $("criteria-filter").value;
  const byCriterion = issuesByCriterion(state.report);
  const rows = state.report.criteriaResults
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !filter || (filter === "unconfirmed" ? item.source && !item.confirmed : filter === "with-issues" ? byCriterion.has(item.criterionId) : item.status === filter));
  $("criteria-caption").textContent = `Wymagania: ${scopeLabel(state.report.meta)}`;
  $("criteria-count").textContent = `Wyświetlono ${rows.length} z ${state.report.criteriaResults.length} kryteriów.`;
  const groups = [];
  for (const row of rows) {
    const name = row.item.group || row.item.principle || "Wymagania";
    if (!groups.length || groups[groups.length - 1].name !== name) groups.push({ name, rows: [] });
    groups[groups.length - 1].rows.push(row);
  }
  $("criteria-body").innerHTML = groups.length ? groups.map((group, g) => `
    <section class="crit-group" aria-labelledby="crit-group-${g}">
      <h3 id="crit-group-${g}">${escapeHtml(group.name)} <span class="muted">(${group.rows.length})</span></h3>
      <ol class="crit-list">${group.rows.map(({ item, index }) => criterionCard(item, index, byCriterion)).join("")}</ol>
    </section>`).join("") : '<p class="empty">Brak kryteriów pasujących do filtra.</p>';
  const unconfirmed = state.report.criteriaResults.filter((item) => item.source && !item.confirmed).length;
  $("confirm-imported").hidden = unconfirmed === 0;
}

function criterionCard(item, index, byCriterion) {
  const label = `${item.displayId || item.criterionId} ${item.title}`;
  const how = HOW_TO_CHECK[item.criterionId];
  return `
        <li class="crit" id="criterion-${index}">
          <div class="crit__head">
            <p class="crit__title"><span class="criterion-id">${escapeHtml(item.displayId || item.criterionId)}</span> ${escapeHtml(item.title)} <span class="crit__level">${item.level === "—" ? "wymaganie dodatkowe" : `poziom ${escapeHtml(item.level)}`}</span></p>
            <p class="criterion-note" id="criterion-${index}-note">${escapeHtml(criterionNote(item))}</p>
            ${how ? `<details class="example howto"><summary>Jak sprawdzić<span class="visually-hidden"> ${escapeHtml(item.displayId || item.criterionId)}</span></summary><p>${escapeHtml(how)}</p></details>` : ""}
          </div>
          <div class="crit__controls">
            <div class="field"><label for="criterion-${index}-status">Status<span class="visually-hidden">: ${escapeHtml(label)}</span></label><select id="criterion-${index}-status" data-criterion="${index}" data-field="status" aria-describedby="criterion-${index}-note">${options(CRITERION_STATUSES, item.status)}</select></div>
            <div class="field crit__issues"><span class="field-label">Problemy</span>${issueButtons(byCriterion.get(item.criterionId), `${item.displayId || item.criterionId}`)}</div>
            <div class="field crit__comment"><label for="criterion-${index}-comment">Komentarz audytora<span class="visually-hidden">: ${escapeHtml(label)}</span></label><textarea id="criterion-${index}-comment" data-criterion="${index}" data-field="auditComment" rows="2">${escapeHtml(item.auditComment)}</textarea></div>
          </div>
        </li>`;
}

function updateCriterionNote(index) {
  const note = $(`criterion-${index}-note`);
  if (note) note.textContent = criterionNote(state.report.criteriaResults[index]);
}

function confirmImportedCriteria() {
  const pending = state.report.criteriaResults.filter((item) => item.source && !item.confirmed);
  pending.forEach((item) => { item.confirmed = true; });
  renderCriteria();
  $("criteria-heading").focus();
  announce(`Potwierdzono ${pending.length} ocen z importu. Decyzja o zgodności należy do Ciebie — upewnij się, że każda została przejrzana.`);
  changed();
}

// ── problemy ──────────────────────────────────────────────────────────────────

// Przyjmuje numery WCAG (1.3.1), numerację standardu (9.1.3.1) i wymagania dodatkowe (7.1.1, §4 DGS).
function parseCriteria(value) {
  const rows = state.report.criteriaResults;
  const tokens = String(value || "").split(/[,;]+|\s+(?=\d)/).map((part) => part.trim()).filter(Boolean);
  const ids = tokens.map((token) => {
    const clean = token.replace(/\.$/, "");
    const row = rows.find((item) => item.criterionId === clean || item.displayId === clean);
    return row ? row.criterionId : clean;
  });
  return [...new Set(ids)];
}

function issueButtons(indexes, criterionLabel) {
  if (!indexes?.length) return '<span class="muted">brak przypisanych</span>';
  return `<ul class="link-list">${indexes.map((index) => `<li><button class="link-button" type="button" data-action="goto-issue" data-index="${index}">Problem ${index + 1}<span class="visually-hidden">: ${escapeHtml(state.report.issues[index].title || "bez tytułu")} (kryterium ${escapeHtml(criterionLabel)})</span></button></li>`).join("")}</ul>`;
}

// ── wybór kryteriów: wyszukiwanie po numerze lub nazwie, zaznaczanie pojedynczo albo zbiorczo ──
const fold = (value) => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");

function matchCriteria(query) {
  const q = fold(query).trim();
  if (!q) return [];
  return state.report.criteriaResults.filter((item) => {
    const ids = [item.criterionId, item.displayId].map(fold);
    return ids.some((id) => id.startsWith(q) || id.startsWith(q.replace(/^9\./, ""))) || matchesQuery(item.title, q);
  });
}

function criteriaPicker(issue, i) {
  return `
        <div class="field field--wide criteria-picker" role="group" aria-labelledby="issue-${i}-criteria-group">
          <span class="field-label" id="issue-${i}-criteria-group">Kryteria naruszone przez ten problem</span>
          <div id="issue-${i}-criteria-chips">${selectedCriteria(issue, i)}</div>
          <label for="issue-${i}-criteria">Dodaj kryteria — wpisz numer albo nazwę</label>
          <input type="search" id="issue-${i}-criteria" data-issue="${i}" data-criteria-search autocomplete="off" aria-describedby="issue-${i}-criteria-help issue-${i}-criteria-count">
          <p class="field-help" id="issue-${i}-criteria-help">Np. „1.3” pokaże 1.3.1, 1.3.2 i kolejne, „kontrast” — kryteria o kontraście. Jeden problem może naruszać kilka kryteriów.</p>
          <p class="field-help" id="issue-${i}-criteria-count" aria-live="polite"></p>
          <div id="issue-${i}-criteria-results"></div>
        </div>`;
}

function selectedCriteria(issue, i) {
  if (!issue.criteria.length) return '<p class="muted">Nie przypisano jeszcze żadnego kryterium.</p>';
  const valid = new Set(state.report.criteriaResults.map((item) => item.criterionId));
  return `<ul class="selected-criteria">${issue.criteria.map((id) => {
    const label = valid.has(id) ? requirementLabel(state.report, id) : `${id} (poza zakresem raportu)`;
    return `<li>${valid.has(id) ? `<button class="chip" type="button" data-action="goto-criterion" data-id="${attr(id)}">${escapeHtml(label)}<span class="visually-hidden"> — przejdź do oceny kryterium</span></button>` : `<span class="chip chip--static">${escapeHtml(label)}</span>`}<button class="chip chip--remove" type="button" data-action="remove-criterion" data-index="${i}" data-id="${attr(id)}">${TRASH_ICON}Usuń<span class="visually-hidden"> kryterium ${escapeHtml(label)}</span></button></li>`;
  }).join("")}</ul>`;
}

function renderCriteriaResults(i) {
  const issue = state.report.issues[i];
  const query = $(`issue-${i}-criteria`)?.value || "";
  const matches = matchCriteria(query);
  const box = $(`issue-${i}-criteria-results`);
  const count = $(`issue-${i}-criteria-count`);
  if (!query.trim()) { box.innerHTML = ""; count.textContent = ""; return; }
  count.textContent = matches.length ? `Pasujących kryteriów: ${matches.length}.` : "Brak pasujących kryteriów w zakresie raportu.";
  const notSelected = matches.filter((item) => !issue.criteria.includes(item.criterionId)).length;
  box.innerHTML = matches.length ? `
    <fieldset class="criteria-results">
      <legend>Pasujące kryteria</legend>
      ${notSelected > 1 ? `<button class="button button--small button--secondary" type="button" data-action="add-all-criteria" data-index="${i}">Zaznacz wszystkie pasujące (${notSelected})</button>` : ""}
      <ul>${matches.map((item, k) => `<li class="choice"><input type="checkbox" id="issue-${i}-crit-${k}" data-issue="${i}" data-criterion-toggle="${attr(item.criterionId)}"${issue.criteria.includes(item.criterionId) ? " checked" : ""}><label for="issue-${i}-crit-${k}">${escapeHtml(item.displayId || item.criterionId)} ${escapeHtml(item.title)} <span class="muted">(${item.level === "—" ? "dodatkowe" : escapeHtml(item.level)})</span></label></li>`).join("")}</ul>
    </fieldset>` : "";
}

function criteriaChanged(i) {
  const issue = state.report.issues[i];
  suggestCriterionStatuses(state.report);
  $(`issue-${i}-criteria-chips`).innerHTML = selectedCriteria(issue, i);
  $(`issue-${i}-blocks-wrap`).innerHTML = blockPanel(issue, i);
  changed();
}

function prevNext(i) {
  const issues = state.report.issues;
  const label = (k) => `${k + 1}. ${issues[k].shortName || issues[k].title || "bez tytułu"}`;
  return `<nav class="prev-next" aria-label="Przejście między problemami">
    ${i > 0 ? `<button class="button button--secondary" type="button" data-action="select-issue" data-index="${i - 1}">← Poprzedni: ${escapeHtml(label(i - 1))}</button>` : "<span></span>"}
    ${i < issues.length - 1 ? `<button class="button" type="button" data-action="select-issue" data-index="${i + 1}">Następny: ${escapeHtml(label(i + 1))} →</button>` : `<button class="button" type="button" id="add-issue-bottom" data-action="new-issue">Dodaj kolejny problem</button>`}
  </nav>`;
}

function issueSummary(issue, index) {
  return `Problem ${index + 1} z ${state.report.issues.length}: ${issue.title || "bez tytułu"} — ${issue.severity}${issue.source && !issue.confirmed ? " — z importu, niepotwierdzony" : ""}`;
}

function addIssue() {
  const report = state.report;
  report.issues.push(newIssue({ id: nextId("A11Y", report.issues), viewIds: report.testedViews[0] ? [report.testedViews[0].id] : [] }));
  const index = report.issues.length - 1;
  ["filter-view", "filter-severity", "filter-criterion", "filter-confirmed"].forEach((id) => { $(id).value = ""; });
  rerender(renderIssues, `#issue-${index}-title`, [index]);
  announce("Dodano problem. Uzupełnij tytuł i opis.");
  changed();
}

const criteriaText = (block) => block.criteria.map((id) => id.replace(/^[a-z]+:/, "")).join(", ") || "bez kryterium WCAG";

function addIssueFromBlock(block) {
  const report = state.report;
  const issue = newIssue({ id: nextId("A11Y", report.issues), viewIds: report.testedViews[0] ? [report.testedViews[0].id] : [] });
  applyBlock(issue, block, true);
  report.issues.push(issue);
  suggestCriterionStatuses(report);
  const index = report.issues.length - 1;
  state.issueView = "problems";
  document.querySelector('input[name="issue-view"][value="problems"]').checked = true;
  ["filter-view", "filter-severity", "filter-criterion", "filter-confirmed"].forEach((id) => { $(id).value = ""; });
  $("block-picker").value = "";
  hideSuggest($("block-picker"));
  rerender(renderIssues, `#issue-${index}-title`, [index]);
  announce(`Dodano problem „${block.title}” z kryteriami ${issue.criteria.join(", ") || "—"}. Dopasuj opis do badanej strony.`);
  changed();
}

// ── podpowiedzi przy wpisywaniu ─────────────────────────────────────────────
// Tryby: list — pole z pozycjami w wierszach; paragraph — gotowe zdania doklejane akapitem;
// single — jedna wartość; blocks — gotowe opisy problemów (tytuł problemu); newIssue — nowy problem z klocka.
const SUGGEST_MODE = {
  manualTools: "list", automaticTools: "list", userTesting: "list", legalBasis: "list", methodology: "list",
  mainProblems: "list", recommendedActions: "list", auditScope: "paragraph", finalRecommendation: "paragraph", disclaimers: "paragraph",
  viewNames: "single", blocks: "blocks", newIssue: "newIssue", disclaimers: "paragraph", fixes: "fix",
  "tech-browser": "tech", "tech-reader": "tech", "tech-other": "tech",
  excludedElements: "paragraph", limitations: "paragraph", executiveSummary: "paragraph",
  envDevice: "single", envOS: "single", envBrowser: "single", envAT: "single", envViewport: "single",
};
const MAX_SHOWN = 12;

function currentLine(field) {
  const value = field.value;
  const caret = field.selectionStart ?? value.length;
  const start = value.lastIndexOf("\n", caret - 1) + 1;
  const end = value.indexOf("\n", caret);
  return { start, end: end === -1 ? value.length : end, text: value.slice(start, end === -1 ? value.length : end) };
}

function suggestionsFor(field) {
  const key = field.dataset.suggest;
  const mode = SUGGEST_MODE[key];
  if (mode === "blocks" || mode === "newIssue") {
    const query = field.value.trim();
    const found = query.length >= 2 ? searchBlocks(query) : [];
    return { mode, query, items: found.map((block) => ({ value: block.id, label: `${block.title} (${criteriaText(block)})`, block })) };
  }
  if (mode === "fix") {
    // Rozwiązania z klocków pasujących do kryteriów problemu (bez kryteriów: wszystkie), zawężane po wpisanym wierszu.
    const issue = state.report.issues[Number(field.dataset.issue)];
    const query = currentLine(field).text.trim();
    const have = fold(field.value);
    const seen = new Set();
    const items = (issue?.criteria.length ? blocksForCriteria(issue.criteria) : ISSUE_BLOCKS)
      .flatMap((block) => block.fixes.map((fix, f) => ({ value: fix.text, label: `${fix.label} (${block.title})`, block, fix, f })))
      .filter((item) => !seen.has(item.value) && seen.add(item.value) && !have.includes(fold(item.value)))
      .filter((item) => matchesQuery(`${item.label} ${item.value}`, query));
    return { mode, query, items };
  }
  if (mode === "tech") {
    const kind = key.slice(5);
    const query = field.value.trim();
    const q = fold(query);
    const have = new Set(techEntries(kind).map((entry) => fold(entry.name)));
    const items = [...TECH[kind].presets, ...TECH[kind].extra].filter((name) => !have.has(fold(name)) && matchesQuery(name, query)).map((name) => ({ value: name, label: name }));
    if (query && !items.some((item) => fold(item.value) === q) && !have.has(q)) items.push({ value: query, label: `własną pozycję „${query}”` });
    return { mode, query, items };
  }
  const declared = key === "legalBasis" ? legalBasisSuggestions(state.report.meta) : key === "envBrowser" ? state.report.browsers.map(withVersion) : key === "envAT" ? state.report.assistiveTech.map(withVersion) : [];
  const all = [...new Set([...declared, ...(SUGGESTIONS[key] || [])])];
  const present = new Set((mode === "list" ? lines(field.value) : [field.value.trim()]).map(fold));
  // Akapit: zawężamy po tekście wpisywanym w bieżącym wierszu, tak jak w polach z listą.
  const query = mode === "single" ? field.value.trim() : currentLine(field).text.trim();
  const items = all
    .filter((item) => !present.has(fold(item)) && !(mode === "paragraph" && fold(field.value).includes(fold(item))))
    .filter((item) => matchesQuery(item, query))
    .map((item) => ({ value: item, label: item }));
  return { mode, query, items };
}

function suggestBox(field) {
  let box = $(`${field.id}-suggest`);
  if (!box) {
    box = document.createElement("div");
    box.id = `${field.id}-suggest`;
    box.className = "suggest";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", `Podpowiedzi: ${document.querySelector(`label[for="${field.id}"]`)?.textContent.trim() || "propozycje"}`);
    field.insertAdjacentElement("afterend", box);
    const count = document.createElement("p");
    count.id = `${field.id}-suggest-count`;
    count.className = "visually-hidden";
    count.setAttribute("aria-live", "polite");
    box.insertAdjacentElement("beforebegin", count);
    field.setAttribute("aria-describedby", [field.getAttribute("aria-describedby"), count.id].filter(Boolean).join(" "));
  }
  return box;
}

function renderSuggest(field) {
  if (field._suggestDismissed) return hideSuggest(field);
  const { mode, query, items } = suggestionsFor(field);
  const box = suggestBox(field);
  const count = $(`${field.id}-suggest-count`);
  if (!items.length) {
    box.innerHTML = (mode === "blocks" || mode === "newIssue") && query.length >= 2 ? '<p class="muted">Brak gotowego opisu. Opisz problem własnymi słowami.</p>' : "";
    count.textContent = "";
    return;
  }
  const shown = items.slice(0, MAX_SHOWN);
  count.textContent = `Podpowiedzi: ${items.length}. Przejdź klawiszem Tab, aby wybrać, Escape zamyka listę.`;
  const verb = mode === "newIssue" ? "Dodaj problem" : mode === "blocks" ? "Użyj opisu" : mode === "single" ? "Wybierz" : "Dodaj";
  const tech = mode === "tech";
  const many = (mode === "list" || tech) && query && items.filter((item) => !/^własną/.test(item.label)).length > 1;
  box.innerHTML = `${(mode === "blocks" || mode === "newIssue") ? `<p class="suggest__lead">Gotowe opisy problemów. Kryteria WCAG dodadzą się same:</p>` : mode === "fix" ? `<p class="suggest__lead">Gotowe rozwiązania${state.report.issues[Number(field.dataset.issue)]?.criteria.length ? " dla kryteriów tego problemu" : ""}:</p>` : ""}
    <ul class="suggest__list">${shown.map((item, k) => `<li><button class="chip" type="button" data-suggest-pick="${k}" data-for="${field.id}"><span class="visually-hidden">${escapeHtml(verb)}: </span>${escapeHtml(item.label)}</button></li>`).join("")}</ul>
    ${items.length > shown.length ? `<p class="muted">…i ${items.length - shown.length} więcej. Wpisz kolejne litery, aby zawęzić.</p>` : ""}
    ${many ? `<button class="button button--small button--secondary" type="button" data-suggest-all data-for="${field.id}">Dodaj wszystkie pasujące (${items.filter((item) => !/^własną/.test(item.label)).length})</button>` : ""}`;
  box._items = shown;
  box._all = items;
}

function hideSuggest(field) {
  const box = $(`${field.id}-suggest`);
  if (box) box.innerHTML = "";
  const count = $(`${field.id}-suggest-count`);
  if (count) count.textContent = "";
}

// Escape w polu albo na propozycji: lista znika, fokus wraca do pola, a kolejny Tab idzie do następnego pola.
// Lista wraca, gdy zaczniesz pisać albo wejdziesz do pola ponownie.
function dismissSuggest(target) {
  const field = target.dataset?.suggest ? target : target.dataset?.for ? $(target.dataset.for) : null;
  if (!field || !$(`${field.id}-suggest`)?.innerHTML.trim()) return false;
  field._suggestDismissed = true;
  hideSuggest(field);
  if (target !== field) field.focus();
  announce("Zamknięto podpowiedzi.");
  return true;
}

// ── klocki: dodane pozycje i zdania pod polem, każdy z przyciskiem usuwania ──────
// Lista: jeden klocek na wiersz; akapit: jeden klocek na akapit. Usuwa X, Backspace albo Delete na X.
const pieceSplit = (field) => (SUGGEST_MODE[field.dataset.suggest] === "paragraph" ? field.value.split(/\n\s*\n/) : field.value.split("\n")).map((part) => part.trim()).filter(Boolean);

function renderPieces(field) {
  const mode = SUGGEST_MODE[field.dataset.suggest];
  if (mode !== "list" && mode !== "paragraph") return;
  let box = $(`${field.id}-pieces`);
  if (!box) {
    box = document.createElement("ul");
    box.id = `${field.id}-pieces`;
    box.className = "pieces";
    box.setAttribute("aria-label", `Dodane: ${document.querySelector(`label[for="${field.id}"]`)?.textContent.trim() || "pozycje"}`);
    ($(`${field.id}-suggest`) || field).insertAdjacentElement("afterend", box);
  }
  const parts = pieceSplit(field);
  // Wiersz, który właśnie piszesz, staje się klockiem dopiero po Enterze albo po wyjściu z pola.
  const typing = document.activeElement === field && !/\n\s*$/.test(field.value) && parts.length;
  if (typing) parts.pop();
  box.hidden = !parts.length;
  box.innerHTML = parts.map((part, k) => `<li class="piece"><span class="piece__text">${escapeHtml(part)}</span><button class="piece__remove" type="button" data-piece="${k}" data-for="${field.id}">${TRASH_ICON}<span class="visually-hidden">Usuń: ${escapeHtml(part)}</span></button></li>`).join("");
}

function removePiece(button) {
  const field = $(button.dataset.for);
  const parts = pieceSplit(field);
  const k = Number(button.dataset.piece);
  const [gone] = parts.splice(k, 1);
  field.value = parts.join(SUGGEST_MODE[field.dataset.suggest] === "paragraph" ? "\n\n" : "\n");
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
  const next = $(`${field.id}-pieces`)?.querySelectorAll(".piece__remove")[Math.min(k, parts.length - 1)];
  (next || field).focus();
  announce(`Usunięto: ${gone}.`);
}

function onSuggestFocus(event) {
  const field = event.target;
  if (field.dataset?.suggest) renderSuggest(field);
}

function onSuggestInput(event) {
  const field = event.target;
  if (!field.dataset?.suggest) return;
  field._suggestDismissed = false;
  renderSuggest(field);
  renderPieces(field);
}

function onSuggestBlur(event) {
  const field = event.target;
  const id = field.dataset?.suggest ? field.id : field.dataset?.for;
  if (!id) return;
  setTimeout(() => {
    const active = document.activeElement;
    if (active?.id === id || active?.dataset?.for === id) return;
    const field = $(id);
    if (!field) return;
    field._suggestDismissed = false;
    hideSuggest(field);
    renderPieces(field);
  }, 0);
}

function pickSuggestion(button) {
  const field = $(button.dataset.for);
  const box = $(`${field.id}-suggest`);
  const mode = SUGGEST_MODE[field.dataset.suggest];
  const picked = button.dataset.suggestAll !== undefined ? box._all : [box._items[Number(button.dataset.suggestPick)]];
  if (mode === "newIssue") return addIssueFromBlock(picked[0].block);
  if (mode === "tech") {
    const kind = field.dataset.suggest.slice(5);
    const names = picked.map((item) => item.value).filter((value, i, all) => !(button.dataset.suggestAll !== undefined && box._all[i] && /^własną/.test(box._all[i].label)));
    names.forEach((name) => { if (!techEntries(kind).some((entry) => fold(entry.name) === fold(name))) (kind === "browser" ? state.report.browsers : state.report.assistiveTech).push({ id: randomId(), name, version: "", ...(kind === "browser" ? {} : { kind }) }); });
    field.value = "";
    renderTech(kind);
    $(`tech-${kind}-search`).focus();
    announce(`Dodano: ${names.join(", ")}. Wersję możesz wpisać obok nazwy.`);
    return changed();
  }
  if (mode === "fix") {
    // Wpisany fragment zamienia się na punkt rekomendacji; przykład kodu trafia do Dowodów.
    const index = Number(field.dataset.issue);
    const issue = state.report.issues[index];
    const { fix } = picked[0];
    const line = currentLine(field);
    const before = field.value.slice(0, line.start).replace(/\n+$/, "");
    const after = field.value.slice(line.end).replace(/^\n+/, "");
    issue.recommendation = [before, fix.text, after].filter((part) => part.trim()).join("\n") + (after ? "" : "\n");
    if (fix.code) issue.codeExamples.push({ id: randomId(), label: `Przykład rozwiązania: ${fix.label}`, language: fix.code.language, code: fix.code.code });
    rerender(renderIssues, `#issue-${index}-recommendation`, [index]);
    const area = $(`issue-${index}-recommendation`);
    if (!after) area.setSelectionRange(area.value.length, area.value.length);
    renderSuggest(area);
    announce(`Dodano do rekomendacji: ${fix.label}${fix.code ? ". Przykład kodu jest w Dowodach" : ""}.`);
    return changed();
  }
  if (mode === "blocks") {
    const index = Number(field.dataset.issue);
    const issue = state.report.issues[index];
    const filled = applyBlock(issue, picked[0].block, false);
    issue.title = picked[0].block.title;
    suggestCriterionStatuses(state.report);
    rerender(renderIssues, `#issue-${index}-title`, [index]);
    announce(`Użyto opisu „${picked[0].block.title}”. Uzupełniono: ${["tytuł", ...filled.filter((item) => item !== "tytuł")].join(", ")}.`);
    hideSuggest($(`issue-${index}-title`));
    return changed();
  }
  const values = picked.map((item) => item.value);
  if (mode === "single") field.value = values[0];
  else if (mode === "paragraph") {
    // Wpisany fragment („Serwis”) zamienia się na wybrane zdanie; reszta tekstu zostaje na swoim miejscu.
    const line = currentLine(field);
    const before = field.value.slice(0, line.start).trim();
    const after = field.value.slice(line.end).trim();
    field.value = [before, ...values, after].filter(Boolean).join("\n\n");
    if (!after) field.value += "\n\n";
  }
  else {
    const line = currentLine(field);
    const before = field.value.slice(0, line.start);
    const after = field.value.slice(line.end);
    const kept = line.text.trim() && !values.some((value) => fold(value).includes(fold(line.text.trim()))) ? `${line.text}\n` : "";
    field.value = `${before}${kept}${values.join("\n")}${after}`.replace(/\n{2,}/g, "\n").replace(/^\n/, "");
  }
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
  field.focus();
  if (mode === "paragraph" && field.value.endsWith("\n\n")) field.setSelectionRange(field.value.length, field.value.length);
  if (mode === "list") {
    field.value = field.value.replace(/\n?$/, "\n");
    field.setSelectionRange(field.value.length, field.value.length);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }
  renderSuggest(field);
  announce(`Dodano: ${values.join("; ")}.`);
}

function renderIssueFilters() {
  const keep = (id, html) => { const field = $(id); const value = field.value; field.innerHTML = html; field.value = value; if (field.value !== value) field.value = ""; };
  keep("filter-view", `<option value="">wszystkie</option>${state.report.testedViews.map((view) => `<option value="${attr(view.id)}">${escapeHtml(view.name || "bez nazwy")}</option>`).join("")}`);
  keep("filter-severity", `<option value="">wszystkie</option>${options(SEVERITIES, null)}`);
  const used = [...new Set(state.report.issues.flatMap((issue) => issue.criteria))].sort((a, b) => a.localeCompare(b, "pl", { numeric: true }));
  keep("filter-criterion", `<option value="">wszystkie</option>${used.map((id) => `<option value="${attr(id)}">${escapeHtml(requirementLabel(state.report, id))}</option>`).join("")}`);
}

function visibleIssues() {
  const filters = { view: $("filter-view").value, severity: $("filter-severity").value, criterion: $("filter-criterion").value, confirmed: $("filter-confirmed").value };
  return state.report.issues.map((issue, index) => ({ issue, index })).filter(({ issue }) =>
    (!filters.view || issue.viewIds.includes(filters.view))
    && (!filters.severity || issue.severity === filters.severity)
    && (!filters.criterion || issue.criteria.includes(filters.criterion))
    && (!filters.confirmed || (issue.source && !issue.confirmed)));
}

// Stan problemu na liście: kompletny, do potwierdzenia albo czego brakuje.
const MISSING_LABELS = { id: "unikalnego identyfikatora", title: "tytułu", viewId: "widoku", criteria: "kryterium", description: "opisu", userImpact: "wpływu na użytkowników", recommendation: "sposobu naprawy", images: "tekstu alternatywnego", codeExamples: "etykiety kodu" };
function issueStatus(index) {
  const issue = state.report.issues[index];
  const missing = [...new Set(state.validation.filter((item) => item.severity === "error" && item.path.startsWith(`issues.${index}.`)).map((item) => MISSING_LABELS[item.path.split(".")[2]]).filter(Boolean))];
  if (missing.length) return { kind: "missing", text: `brakuje: ${missing.join(", ")}` };
  if (issue.source && !issue.confirmed) return { kind: "pending", text: "do potwierdzenia" };
  return { kind: "done", text: "kompletny" };
}

function renderIssues() {
  const issues = state.report.issues;
  if (state.currentIssue >= issues.length) state.currentIssue = Math.max(0, issues.length - 1);
  renderIssueNav();
  renderIssueEditor();
}

function renderIssueNav() {
  const visible = visibleIssues();
  const issues = state.report.issues;
  const byCriteria = state.issueView === "criteria";
  $("issue-list").hidden = byCriteria;
  $("criteria-view").hidden = !byCriteria;
  $("issue-list-heading").textContent = byCriteria ? "Problemy według kryteriów sukcesu" : "Lista problemów";
  if (byCriteria) { renderCriteriaView(visible); return; }
  $("issue-count").textContent = `Wyświetlono ${visible.length} z ${issues.length} problemów.`;
  $("issue-list").innerHTML = visible.length ? `<ol class="issue-nav__list">${visible.map(({ issue, index }) => {
    const status = issueStatus(index);
    const current = index === state.currentIssue;
    const name = escapeHtml(issue.shortName || issue.title || "bez tytułu");
    const tools = `<div class="issue-row__tools">
        ${index > 0 ? `<button class="icon-button" type="button" data-action="move-issue" data-place="nav" data-index="${index}" data-dir="-1"><span aria-hidden="true">↑</span><span class="visually-hidden">Przenieś wyżej: problem ${index + 1}, ${name}</span></button>` : ""}
        ${index < issues.length - 1 ? `<button class="icon-button" type="button" data-action="move-issue" data-place="nav" data-index="${index}" data-dir="1"><span aria-hidden="true">↓</span><span class="visually-hidden">Przenieś niżej: problem ${index + 1}, ${name}</span></button>` : ""}
        <button class="icon-button icon-button--danger" type="button" data-action="remove-issue" data-place="nav" data-index="${index}">${TRASH_ICON}<span class="visually-hidden">Usuń problem ${index + 1}, ${name}</span></button>
      </div>`;
    return `<li class="issue-row"><button class="issue-pick${current ? " is-current" : ""}" type="button" data-action="select-issue" data-index="${index}"${current ? ' aria-current="true"' : ""}>
      <span class="issue-pick__title"><span class="issue-pick__num">${index + 1}.</span> ${escapeHtml(issue.shortName || issue.title || "Problem bez tytułu")}</span>
      <span class="issue-pick__meta">${issue.id ? `${escapeHtml(issue.id)} · ` : ""}${escapeHtml(issue.criteria.map((id) => id.replace(/^[a-z]+:/, "")).join(", ") || "bez kryterium")} · ${escapeHtml(issue.severity)}</span>
      <span class="issue-pick__status is-${status.kind}">${escapeHtml(status.text)}</span>
    </button>${tools}</li>`;
  }).join("")}</ol>` : '<p class="empty">Brak problemów do wyświetlenia. Dodaj pierwszy problem powyżej.</p>';
}


// Pusty problem (np. dodany przez pomyłkę) usuwamy bez pytania; wypełniony dopiero po potwierdzeniu.
function isEmptyIssue(issue) {
  if (!issue) return true;
  const texts = ["title", "description", "userImpact", "recommendation", "evidence", "notes"].some((key) => String(issue[key] || "").trim());
  return !texts && !issue.criteria.length && !issue.images.length && !issue.codeExamples.length && !issue.stepsToReproduce.length;
}

// Formularz problemu da się zwinąć, żeby lista po lewej była widoczna w całości.
function setIssueEditor(open) {
  const button = $("toggle-issue-editor");
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Zwiń formularz problemu" : "Rozwiń formularz problemu";
  $("issue-editor").hidden = !open;
  document.querySelector(".issues-layout")?.classList.toggle("is-collapsed", !open);
}

function renderIssueEditor() {
  const issues = state.report.issues;
  const box = $("issue-editor");
  if (!issues.length) { box.innerHTML = '<p class="empty">Tu pojawi się formularz wybranego problemu.</p>'; return; }
  const i = state.currentIssue;
  box.innerHTML = issueCard(issues[i], i);
  box.querySelectorAll("input[data-image-upload]").forEach((input) => input.addEventListener("change", onImageUpload));
  applyFieldErrors();
}

function renderCriteriaView(visible) {
  const allowed = new Set(visible.map(({ index }) => index));
  const byCriterion = issuesByCriterion(state.report);
  const groups = state.report.criteriaResults
    .map((item) => ({ item, indexes: (byCriterion.get(item.criterionId) || []).filter((index) => allowed.has(index)) }))
    .filter((group) => group.indexes.length);
  const orphans = visible.filter(({ issue }) => !issue.criteria.length).map(({ index }) => index);
  $("issue-count").textContent = `Kryteria z problemami: ${groups.length}. Problemy: ${visible.length}.`;
  const plural = (n) => (n === 1 ? "problem" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "problemy" : "problemów");
  $("criteria-view").innerHTML = groups.length || orphans.length ? groups.map(({ item, indexes }) => `
    <section class="card criterion-group" aria-labelledby="cv-${attr(item.criterionId.replace(/[^a-z0-9]/gi, "-"))}">
      <h4 id="cv-${attr(item.criterionId.replace(/[^a-z0-9]/gi, "-"))}">${escapeHtml(item.displayId || item.criterionId)} ${escapeHtml(item.title)} — ${indexes.length} ${plural(indexes.length)}</h4>
      <p class="muted">Poziom ${escapeHtml(item.level)}, status: ${escapeHtml(item.status)}.</p>
      <ul class="issue-links">${indexes.map((index) => `<li><button class="link-button" type="button" data-action="goto-issue" data-index="${index}">Problem ${index + 1}: ${escapeHtml(state.report.issues[index].title || "bez tytułu")}</button> <span class="muted">(${escapeHtml(state.report.issues[index].severity)})</span></li>`).join("")}</ul>
      <button class="button button--small button--secondary" type="button" data-action="goto-criterion" data-id="${attr(item.criterionId)}">Ocena w tabeli zgodności<span class="visually-hidden">: ${escapeHtml(item.displayId || item.criterionId)}</span></button>
    </section>`).join("") + (orphans.length ? `
    <section class="card criterion-group" aria-labelledby="cv-orphans"><h4 id="cv-orphans">Bez przypisanego kryterium — ${orphans.length} ${plural(orphans.length)}</h4>
      <ul class="issue-links">${orphans.map((index) => `<li><button class="link-button" type="button" data-action="goto-issue" data-index="${index}">Problem ${index + 1}: ${escapeHtml(state.report.issues[index].title || "bez tytułu")}</button></li>`).join("")}</ul></section>` : "")
    : '<p class="empty">Brak problemów do wyświetlenia.</p>';
}

function hint(key, i) {
  const item = FIELD_HINTS[key];
  if (!item) return "";
  return `<p class="field-help" id="issue-${i}-${key}-tip">${escapeHtml(item.tip)}</p><details class="example"><summary>Przykład<span class="visually-hidden">: ${escapeHtml(key === "stepsToReproduce" ? "kroki odtworzenia" : key === "userImpact" ? "wpływ na użytkowników" : key === "recommendation" ? "rekomendacja" : key === "evidence" ? "lokalizacja" : key === "title" ? "tytuł" : "opis")}</span></summary><p>${escapeHtml(item.example).replace(/\n/g, "<br>")}</p></details>`;
}

function blockPanel(issue, i) {
  // Rozwiązania podpowiada pole „Jak naprawić” w trakcie pisania; tu zostaje tylko wskazówka o pokrewnych kryteriach.
  const consider = [...new Set(blocksForCriteria(issue.criteria).filter((block) => block.id === issue.blockId).flatMap((block) => block.alsoConsider || []))];
  return issue.criteria.length && consider.length ? `
      <div class="nested blocks" role="note">
        <p class="consider"><strong>Sprawdź też:</strong> ${escapeHtml(consider.join("; "))}. Zależnie od przypadku ten problem może naruszać także te kryteria.</p>
      </div>` : "";
}

function viewPicker(issue, i) {
  const views = state.report.testedViews;
  if (!views.length) return `<div class="field field--wide"><span class="field-label" id="issue-${i}-viewId">Widoki, w których występuje problem</span><p class="muted">Najpierw dodaj badane widoki w kroku 2.</p></div>`;
  return `<fieldset class="field field--wide pick-group" id="issue-${i}-views">
    <legend>Widoki, w których występuje problem <span class="required">(wymagane)</span></legend>
    <p class="field-help">Ten sam błąd na wielu stronach opisz raz i zaznacz wszystkie widoki. Adresy problemu w raporcie biorą się z zaznaczonych widoków; brakujący adres dodasz w kroku z widokami.</p>
    <div class="pick-grid">${views.map((view, v) => `<div class="choice choice--view"><input type="checkbox" id="issue-${i}-${v === 0 ? "viewId" : `view-${v}`}" data-issue="${i}" data-view-toggle="${attr(view.id)}"${issue.viewIds.includes(view.id) ? " checked" : ""}><label for="issue-${i}-${v === 0 ? "viewId" : `view-${v}`}">${escapeHtml(view.name || `Widok ${v + 1}`)}<span class="choice__url">${view.url ? escapeHtml(view.url) : "bez adresu"}</span></label></div>`).join("")}</div>
  </fieldset>`;
}

function environmentPicker(issue, i) {
  const envs = state.report.environment;
  if (!envs.length) return "";
  const all = !issue.environmentIds.length;
  return `<fieldset class="field field--wide pick-group" id="issue-${i}-envs">
    <legend>Środowiska, w których wystąpił problem</legend>
    <div class="choice"><input type="checkbox" id="issue-${i}-env-all" data-issue="${i}" data-env-all${all ? " checked" : ""} aria-describedby="issue-${i}-env-help"><label for="issue-${i}-env-all">Wszystkie badane środowiska</label></div>
    <p class="field-help" id="issue-${i}-env-help">Odznacz, jeśli problem wystąpił tylko w części środowisk, i wskaż które.</p>
    <div class="pick-grid" id="issue-${i}-env-list"${all ? " hidden" : ""}>${envs.map((env, e) => `<div class="choice"><input type="checkbox" id="issue-${i}-env-${e}" data-issue="${i}" data-env-toggle="${attr(env.id)}"${issue.environmentIds.includes(env.id) ? " checked" : ""}><label for="issue-${i}-env-${e}">${escapeHtml(environmentLabel(env, e))}</label></div>`).join("")}</div>
  </fieldset>`;
}

function issueCard(issue, i) {
  const field = (key, label, html, wide = false, help = "") => `<div class="field${wide ? " field--wide" : ""}"><label for="issue-${i}-${key}">${label}</label>${html}${help}</div>`;
  const input = (key, extra = "") => `<input id="issue-${i}-${key}" data-issue="${i}" data-field="${key}" value="${attr(issue[key])}"${extra}>`;
  const area = (key, rows, value = issue[key], tip = null) => `<textarea id="issue-${i}-${key}" data-issue="${i}" data-field="${key}" rows="${rows}"${tip ? ` aria-describedby="issue-${i}-${tip}-tip"` : ""}>${escapeHtml(value)}</textarea>`;
  const codes = issue.codeExamples.map((code, c) => `
    <div class="card card--nested" role="group" aria-labelledby="issue-${i}-code-${c}-heading">
      <h6 id="issue-${i}-code-${c}-heading">Fragment kodu ${c + 1}</h6>
      <div class="form-grid">
        <div class="field"><label for="issue-${i}-code-${c}-label">Etykieta <span class="required">(wymagane)</span></label><input id="issue-${i}-code-${c}-label" data-issue="${i}" data-code="${c}" data-field="label" value="${attr(code.label)}"></div>
        <div class="field"><label for="issue-${i}-code-${c}-language">Język</label><select id="issue-${i}-code-${c}-language" data-issue="${i}" data-code="${c}" data-field="language">${options(["html", "css", "js", "ts", "jsx", "tsx", "json", "xml", "text"], code.language)}</select></div>
        <div class="field field--wide"><label for="issue-${i}-code-${c}-code">Kod</label><textarea id="issue-${i}-code-${c}-code" class="code-input" data-issue="${i}" data-code="${c}" data-field="code" rows="6" spellcheck="false" autocapitalize="off">${escapeHtml(code.code)}</textarea></div>
      </div>
      <button class="button button--small button--danger" type="button" data-action="remove-code" data-issue="${i}" data-code="${c}">${TRASH_ICON}Usuń fragment kodu ${c + 1}</button>
    </div>`).join("");
  const images = issue.images.map((image, m) => `
    <div class="card card--nested" role="group" aria-labelledby="issue-${i}-image-${m}-heading">
      <h6 id="issue-${i}-image-${m}-heading">Zrzut ${m + 1}: ${escapeHtml(image.fileName || "bez nazwy")}</h6>
      <div class="image-editor">
        <img src="${attr(image.dataUrl)}" alt="" class="image-thumb">
        <div class="form-grid">
          <div class="field field--wide"><label for="issue-${i}-image-${m}-alt">Tekst alternatywny</label><textarea id="issue-${i}-image-${m}-alt" data-issue="${i}" data-image="${m}" data-field="alt" rows="2" aria-describedby="issue-${i}-image-${m}-alt-help">${escapeHtml(image.alt)}</textarea><p class="field-help" id="issue-${i}-image-${m}-alt-help">Opisz, co widać na zrzucie i na czym polega błąd. Bez tekstu alternatywnego obraz trafi do raportu jako dekoracyjny (pusty alt).</p></div>
          <div class="field field--wide"><label for="issue-${i}-image-${m}-caption">Podpis pod obrazem</label><input id="issue-${i}-image-${m}-caption" data-issue="${i}" data-image="${m}" data-field="caption" value="${attr(image.caption)}"></div>
        </div>
      </div>
      <div class="card-actions">
        ${m > 0 ? `<button class="button button--small button--secondary" type="button" data-action="move-image" data-issue="${i}" data-image="${m}" data-dir="-1">Przenieś wyżej<span class="visually-hidden">: obraz ${m + 1}</span></button>` : ""}
        ${m < issue.images.length - 1 ? `<button class="button button--small button--secondary" type="button" data-action="move-image" data-issue="${i}" data-image="${m}" data-dir="1">Przenieś niżej<span class="visually-hidden">: obraz ${m + 1}</span></button>` : ""}
        <button class="button button--small button--danger" type="button" data-action="remove-image" data-issue="${i}" data-image="${m}">${TRASH_ICON}Usuń obraz ${m + 1}</button>
      </div>
    </div>`).join("");
  const imported = issue.source ? `
    <div class="field field--check field--wide import-confirm"><input type="checkbox" id="issue-${i}-confirmed" data-issue="${i}" data-field="confirmed"${issue.confirmed ? " checked" : ""}><label for="issue-${i}-confirmed">Zweryfikowałem ten problem (zaimportowany z: ${escapeHtml(issue.source)})</label></div>` : "";

  return `
  <section class="issue-card" data-card data-issue-card="${i}" aria-labelledby="issue-${i}-editor-heading">
    <h3 class="issue-card__heading" id="issue-${i}-editor-heading" tabindex="-1" data-card-title>${escapeHtml(issueSummary(issue, i))}</h3>
    <div class="issue-card__body">
      <div class="form-grid">
        ${imported}
        ${field("id", "Identyfikator", input("id", ` aria-describedby="issue-${i}-id-help" autocomplete="off" spellcheck="false"`), false, `<p class="field-help" id="issue-${i}-id-help">Nadawany automatycznie (A11Y-001, A11Y-002…). Możesz go zmienić, np. na numer z systemu zgłoszeń.</p>`)}
        ${field("title", 'Tytuł problemu <span class="required">(wymagane)</span>', input("title", ` aria-describedby="issue-${i}-title-tip" data-suggest="blocks" autocomplete="off"`), true, hint("title", i))}
        ${viewPicker(issue, i)}
        ${environmentPicker(issue, i)}
        ${field("issueType", "Rodzaj", `<select id="issue-${i}-issueType" data-issue="${i}" data-field="issueType">${options(ISSUE_TYPES, issue.issueType)}</select>`)}
        ${field("severity", "Priorytet", `<select id="issue-${i}-severity" data-issue="${i}" data-field="severity" aria-describedby="issue-${i}-severity-tip">${options(SEVERITIES, issue.severity)}</select>`, false, `<p class="field-help" id="issue-${i}-severity-tip">${escapeHtml(SEVERITY_HINT)}</p>`)}
        ${field("shortName", "Krótka nazwa do tabeli „Problemy w skrócie” (opcjonalnie)", input("shortName", ` aria-describedby="issue-${i}-shortName-help"`), true, `<p class="field-help" id="issue-${i}-shortName-help">Gdy puste, w tabeli pojawi się tytuł problemu.</p>`)}
        ${criteriaPicker(issue, i)}
        ${field("description", "Opis problemu", area("description", 4, issue.description, "description"), true, hint("description", i))}
        ${field("stepsToReproduce", "Kroki odtworzenia", area("stepsToReproduce", 3, issue.stepsToReproduce.join("\n"), "stepsToReproduce"), true, hint("stepsToReproduce", i))}
        ${field("userImpact", "Wpływ na użytkowników", area("userImpact", 3, issue.userImpact, "userImpact"), true, hint("userImpact", i))}
        ${field("recommendation", "Jak naprawić", area("recommendation", 5, issue.recommendation, "recommendation").replace("<textarea ", '<textarea data-suggest="fixes" '), true, hint("recommendation", i))}
        ${field("evidence", "Lokalizacja", area("evidence", 3, issue.evidence, "evidence"), true, hint("evidence", i))}
      </div>
      <div class="nested evidence" role="group" aria-labelledby="issue-${i}-evidence-heading">
        <h4 id="issue-${i}-evidence-heading">Dowody</h4>
        <div class="evidence__group" role="group" aria-labelledby="issue-${i}-codes-heading">
          <h5 id="issue-${i}-codes-heading">Fragmenty kodu</h5>
          ${codes || "<p class=\"empty\">Brak fragmentów kodu.</p>"}
          <button class="button button--small button--secondary" type="button" data-action="add-code" data-index="${i}">Dodaj fragment kodu</button>
        </div>
        <div class="evidence__group" role="group" aria-labelledby="issue-${i}-images-heading">
          <h5 id="issue-${i}-images-heading">Zrzuty ekranu</h5>
          ${images || "<p class=\"empty\">Brak zrzutów ekranu.</p>"}
          <div class="dropzone" data-index="${i}">
            <p class="dropzone__text">Wklej zrzut ekranu skrótem <kbd>Cmd</kbd>+<kbd>V</kbd> (Windows: <kbd>Ctrl</kbd>+<kbd>V</kbd>) albo przeciągnij pliki tutaj.</p>
            <div class="field"><label for="issue-${i}-image-upload">Albo wybierz pliki z dysku</label><input id="issue-${i}-image-upload" type="file" multiple accept="image/png,image/jpeg,image/webp" data-image-upload data-index="${i}" aria-describedby="issue-${i}-image-help"><p class="field-help" id="issue-${i}-image-help">PNG, JPG lub WebP, do 25 MB każdy. Większe niż 2000 pikseli zmniejszymy automatycznie. Można dodać kilka naraz.</p></div>
          </div>
        </div>
      </div>
      <div class="form-grid nested">
        ${field("reauditStatus", "Status reaudytu", `<select id="issue-${i}-reauditStatus" data-issue="${i}" data-field="reauditStatus">${options(REAUDIT_STATUSES, issue.reauditStatus, { "": "nie badano ponownie" })}</select>`)}
        ${field("reauditComment", "Komentarz reaudytu", area("reauditComment", 2))}
        ${field("notes", "Uwagi wewnętrzne", area("notes", 2), true)}
        <div class="field field--check field--wide"><input type="checkbox" id="issue-${i}-includeNotes" data-issue="${i}" data-field="includeNotesInExport"${issue.includeNotesInExport ? " checked" : ""}><label for="issue-${i}-includeNotes">Dołącz uwagi wewnętrzne do raportu</label></div>
      </div>
      <div id="issue-${i}-blocks-wrap">${blockPanel(issue, i)}</div>
      <div class="card-actions">
        ${i > 0 ? `<button class="button button--small button--secondary" type="button" data-action="move-issue" data-index="${i}" data-dir="-1">Przenieś wyżej<span class="visually-hidden">: problem ${i + 1}</span></button>` : ""}
        ${i < state.report.issues.length - 1 ? `<button class="button button--small button--secondary" type="button" data-action="move-issue" data-index="${i}" data-dir="1">Przenieś niżej<span class="visually-hidden">: problem ${i + 1}</span></button>` : ""}
        <button class="button button--small button--secondary" type="button" data-action="duplicate-issue" data-index="${i}">Duplikuj<span class="visually-hidden"> problem ${i + 1}</span></button>
        <button class="button button--small button--danger" type="button" data-action="remove-issue" data-index="${i}">${TRASH_ICON}Usuń problem ${i + 1}</button>
      </div>
      ${prevNext(i)}
    </div>
  </section>`;
}

async function onImageUpload(event) {
  const input = event.target;
  await addImages(Number(input.dataset.index), [...input.files]);
  input.value = "";
}

// Dodaje obrazy z wyboru pliku, przeciągnięcia albo schowka (Cmd/Ctrl+V).
async function addImages(index, files) {
  const issue = state.report.issues[index];
  if (!issue || !files.length) return;
  let added = 0;
  const skipped = [];
  for (const file of files) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { skipped.push(`${file.name || "plik"} (zły format)`); continue; }
    if (file.size > MAX_IMAGE_BYTES) { skipped.push(`${file.name || "plik"} (ponad 25 MB)`); continue; }
    try {
      const image = await readImage(file);
      const name = file.name && file.name !== "image.png" ? file.name : `zrzut-${issue.images.length + 1}.png`;
      issue.images.push({ id: randomId(), fileName: name, alt: "", isDecorative: true, caption: "", ...image });
      added++;
    } catch { skipped.push(file.name || "plik"); }
  }
  if (added) {
    rerender(renderIssues, `#issue-${index}-image-${issue.images.length - added}-alt`, [index]);
    changed();
  }
  announce([added ? `Dodano obrazy: ${added}. Wpisz tekst alternatywny. Bez niego obraz będzie dekoracyjny.` : "", skipped.length ? `Pominięto: ${skipped.join(", ")}. Dozwolone są PNG, JPG i WebP do 25 MB.` : ""].filter(Boolean).join(" "), !added);
}

// ── podpowiedź „?” (toggletip) ───────────────────────────────────────────────
// Przycisk pokazuje i chowa treść (Enter, Spacja, kliknięcie); Escape chowa i zostawia fokus na przycisku.
// Treść jest w DOM zaraz za przyciskiem, więc czytnik dojdzie do niej strzałką po rozwinięciu.
const KEY_VIEW_TIP = "Widok kluczowy to strona lub ekran, bez których użytkownik nie załatwi najważniejszych spraw w serwisie, np. strona główna, logowanie, formularz kontaktowy, koszyk i płatność, deklaracja dostępności. Metodyka WCAG-EM (W3C) zaleca, by takie strony zawsze trafiły do próby. W raporcie przy nazwie widoku pojawi się dopisek „widok kluczowy”.";

function toggletip(id, label, text) {
  return `<button type="button" class="toggletip" data-toggletip aria-expanded="false" aria-controls="${id}"><span aria-hidden="true">?</span><span class="visually-hidden">${escapeHtml(label)}</span></button><p class="toggletip__text" id="${id}" hidden>${escapeHtml(text)}</p>`;
}

function setToggletip(button, open) {
  button.setAttribute("aria-expanded", String(open));
  $(button.getAttribute("aria-controls")).hidden = !open;
}

function bindToggletips() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-toggletip]");
    document.querySelectorAll('[data-toggletip][aria-expanded="true"]').forEach((other) => { if (other !== button) setToggletip(other, false); });
    if (button) setToggletip(button, button.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = [...document.querySelectorAll('[data-toggletip][aria-expanded="true"]')];
    if (!open.length) return;
    open.forEach((button) => setToggletip(button, false));
    const own = document.activeElement?.closest?.("[data-toggletip]");
    if (own) event.preventDefault();
  });
}

function bindImageDrop() {
  document.addEventListener("paste", (event) => {
    if (STEPS[state.step] !== "issues" || !state.report.issues.length) return;
    const files = [...(event.clipboardData?.files || [])].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    event.preventDefault();
    addImages(state.currentIssue, files);
  });
  document.addEventListener("dragover", (event) => {
    const zone = event.target.closest?.(".dropzone");
    if (!zone) return;
    event.preventDefault();
    zone.classList.add("is-over");
  });
  document.addEventListener("dragleave", (event) => event.target.closest?.(".dropzone")?.classList.remove("is-over"));
  document.addEventListener("drop", (event) => {
    const zone = event.target.closest?.(".dropzone");
    if (!zone) return;
    event.preventDefault();
    zone.classList.remove("is-over");
    addImages(Number(zone.dataset.index), [...event.dataTransfer.files]);
  });
}

// Wczytuje obraz, zapisuje wymiary; WebP zamienia na PNG, bo starsze wersje Worda go nie wyświetlają.
function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let dataUrl = reader.result;
        const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const width = Math.round(img.naturalWidth * scale);
        const height = Math.round(img.naturalHeight * scale);
        // Duże zrzuty zmniejszamy do 2000 px (to wciąż ostro w raporcie A4), a gdy PNG nadal waży ponad 3 MB, zapisujemy JPG.
        if (file.type === "image/webp" || scale < 1 || file.size > COMPACT_IMAGE_BYTES) {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          dataUrl = canvas.toDataURL("image/png");
          if (dataUrlSize(dataUrl) > COMPACT_IMAGE_BYTES) {
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, width, height);
            dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          }
        }
        resolve({ dataUrl, width, height });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── walidacja ─────────────────────────────────────────────────────────────────

function scheduleValidation() {
  clearTimeout(state.validateTimer);
  state.validateTimer = setTimeout(validateNow, 500);
}

function validateNow() {
  state.validation = validateProject(state.report);
  if (STEPS[state.step] === "issues" && state.issueView === "problems" && !$("issue-list").contains(document.activeElement) && !pointerDown) renderIssueNav();
  renderErrorSummary();
  applyFieldErrors();
  updateMetrics();
}

function renderErrorSummary() {
  const box = $("error-summary");
  const show = STEPS[state.step] === "preview" && state.validation.length > 0;
  box.hidden = !show;
  if (!show) return;
  const errors = state.validation.filter((item) => item.severity === "error");
  $("error-summary-heading").textContent = errors.length ? `Raport wymaga uzupełnienia (${errors.length})` : "Raport wymaga potwierdzenia danych z importu";
  $("error-list").innerHTML = state.validation.map((item) => `<li><a href="#${attr(targetFor(item.path))}" data-path="${attr(item.path)}">${escapeHtml(item.message)}</a></li>`).join("");
}

function applyFieldErrors() {
  document.querySelectorAll(".field-error").forEach((element) => element.remove());
  document.querySelectorAll("[aria-invalid]").forEach((element) => {
    element.removeAttribute("aria-invalid");
    const ids = (element.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && !id.endsWith("-error"));
    if (ids.length) element.setAttribute("aria-describedby", ids.join(" "));
    else element.removeAttribute("aria-describedby");
  });
  if (!state.showErrors) return;
  for (const item of state.validation) {
    if (item.severity !== "error") continue;
    const target = $(targetFor(item.path));
    if (!target || !target.matches("input, select, textarea") || $(`${target.id}-error`)) continue;
    const message = document.createElement("p");
    message.className = "field-error";
    message.id = `${target.id}-error`;
    message.textContent = item.message;
    target.insertAdjacentElement("afterend", message);
    target.setAttribute("aria-invalid", "true");
    target.setAttribute("aria-describedby", [target.getAttribute("aria-describedby"), message.id].filter(Boolean).join(" "));
  }
}

function stepFor(path) {
  if (path.startsWith("meta.")) return "meta";
  if (path.startsWith("testedViews")) return "views";
  if (path.startsWith("criteriaResults")) return "criteria";
  if (path.startsWith("issues.")) return "issues";
  return "summary";
}

function targetFor(path) {
  const fixed = { "meta.reportTitle": "report-title", "meta.auditedEntity": "audited-entity", "meta.websiteUrl": "website-url", "meta.auditStartDate": "audit-start-date", "meta.auditEndDate": "audit-end-date", "summary.reportCreatedAt": "report-created-at", testedViews: "add-view", criteriaResults: "criteria-heading" };
  if (fixed[path]) return fixed[path];
  let match = path.match(/^issues\.(\d+)\.(id|title|viewId|criteria|description|userImpact|recommendation|confirmed)$/);
  if (match) return `issue-${match[1]}-${match[2]}`;
  match = path.match(/^issues\.(\d+)\.codeExamples\.(\d+)/);
  if (match) return `issue-${match[1]}-code-${match[2]}-label`;
  match = path.match(/^issues\.(\d+)\.images\.(\d+)/);
  if (match) return `issue-${match[1]}-image-${match[2]}-alt`;
  return `${stepFor(path)}-heading`;
}

function onErrorLink(event) {
  const link = event.target.closest("a[data-path]");
  if (!link) return;
  event.preventDefault();
  const path = link.dataset.path;
  const issueIndex = path.match(/^issues\.(\d+)/)?.[1];
  if (issueIndex !== undefined) ["filter-view", "filter-severity", "filter-criterion", "filter-confirmed"].forEach((id) => { $(id).value = ""; });
  if (path === "criteriaResults") $("criteria-filter").value = /niepotwierdz/.test(link.textContent) ? "unconfirmed" : "do weryfikacji";
  showStep(STEPS.indexOf(stepFor(path)), false);
  const target = $(targetFor(path));
  target?.closest("details")?.setAttribute("open", "");
  target?.focus();
}

// ── liczniki ──────────────────────────────────────────────────────────────────

function updateMetrics() {
  const report = state.report;
  const stats = criteriaStats(report);
  const severities = severityCounts(report);
  $("metric-views").textContent = report.testedViews.length;
  $("metric-issues").textContent = report.issues.length;
  $("metric-priority").textContent = severities["Priorytet 1"];
  $("metric-failed").textContent = stats.counts["niespełnione"];
  $("metric-untested").textContent = stats.counts["do weryfikacji"];
  const errors = state.validation.filter((item) => item.severity === "error").length;
  const warnings = state.validation.length - errors;
  const badge = $("completeness");
  badge.textContent = errors ? `Do uzupełnienia: ${errors}. Do potwierdzenia: ${warnings}.` : warnings ? `Wymagane pola uzupełnione. Do potwierdzenia: ${warnings}.` : "Raport jest kompletny.";
  badge.classList.toggle("is-complete", errors === 0 && warnings === 0);
}

function updatePercentHelp() {
  const stats = criteriaStats(state.report);
  $("percent-help").textContent = stats.percentPassed === null
    ? `Nie da się obliczyć automatycznie: ${stats.counts["do weryfikacji"]} kryteriów nie ma rozstrzygniętej oceny. Puste pole = raport pokaże „nie obliczono”.`
    : `Z tabeli kryteriów wynika ${String(stats.percentPassed).replace(".", ",")}%. Puste pole = raport użyje tej wartości.`;
}

// ── import, eksport ───────────────────────────────────────────────────────────

async function onImport(event) {
  const files = [...event.target.files];
  event.target.value = "";
  if (!files.length) return;
  try {
    const loaded = await Promise.all(files.map(async (file) => ({ name: file.name, text: await file.text() })));
    const isProject = loaded.some((file) => /"criteriaResults"|"schemaVersion"/.test(file.text.slice(0, 5000)));
    const { report, messages } = importFiles(isProject ? defaultProject() : state.report, loaded);
    if (isProject) {
      await persist();
      await createAudit(report, { silent: true });
      messages.push(`Projekt dodano do rejestru jako ${report.meta.signature}.`);
    } else state.report = report;
    hydrateFields();
    validateNow();
    await persist();
    showStep(state.step, false);
    $("open-files").focus();
    announce(messages.join(" "));
  } catch (error) {
    announce(`Nie udało się wczytać plików. ${error.message}`, true);
  }
}

function downloadProject() {
  download(new Blob([JSON.stringify(state.report, null, 2)], { type: "application/json" }), `${fileBaseName(state.report)}.projekt.json`);
  announce("Zapisano plik projektu. Wczytasz go przyciskiem „Wczytaj pliki”.");
}

function exportReport(format) {
  validateNow();
  const draft = state.validation.length > 0;
  const base = fileBaseName(state.report);
  try {
    if (format === "html") download(new Blob([renderReportHtml(state.report)], { type: "text/html;charset=utf-8" }), `${base}.html`);
    if (format === "md") download(new Blob([renderReportMarkdown(state.report)], { type: "text/markdown;charset=utf-8" }), `${base}.md`);
    if (format === "docx") download(new Blob([renderReportDocx(state.report)], { type: DOCX_MIME }), `${base}.docx`);
    if (format === "pdf") return printPdf(draft);
    const name = { html: "HTML", md: "Markdown", docx: "DOCX" }[format];
    announce(draft ? `Pobrano raport ${name} jako wersję roboczą — zawiera listę braków na początku.` : `Pobrano raport ${name}.`);
  } catch (error) {
    announce(`Nie udało się przygotować pliku: ${error.message}`, true);
  }
}

function printPdf(draft) {
  const frame = document.createElement("iframe");
  frame.className = "print-frame";
  frame.title = "Raport do druku";
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.srcdoc = renderReportHtml(state.report);
  frame.addEventListener("load", () => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } finally {
      setTimeout(() => frame.remove(), 1000);
    }
  }, { once: true });
  document.body.append(frame);
  announce(`Otwieram okno drukowania. Wybierz „Zapisz jako PDF”.${draft ? " Raport jest wersją roboczą." : ""}`);
}

function estimatePages(html) {
  const textLength = html.replace(/<style[\s\S]*?<\/style>/, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length;
  const images = state.report.issues.reduce((sum, issue) => sum + issue.images.length, 0);
  return Math.max(1, Math.ceil(textLength / 2800 + images * 0.4 + state.report.criteriaResults.length / 35));
}

function refreshPreview() {
  const html = renderReportHtml(state.report, { editable: true });
  const frame = $("report-preview");
  frame.onload = () => {
    frame.contentDocument?.addEventListener("dblclick", (event) => {
      const target = event.target.closest?.("[data-edit]");
      if (target) gotoField(target.dataset.edit);
    });
  };
  frame.srcdoc = html;
  $("page-estimate").textContent = `Raport ma około ${estimatePages(html)} stron A4 · problemy: ${state.report.issues.length} · wymagania w tabeli: ${state.report.criteriaResults.length}.`;
  const errors = state.validation.filter((item) => item.severity === "error").length;
  $("draft-state").textContent = state.validation.length
    ? `Raport zostanie oznaczony jako wersja robocza: ${errors} braków i ${state.validation.length - errors} pozycji do potwierdzenia. Lista jest powyżej.`
    : "Raport jest kompletny. Pobrane pliki nie będą oznaczone jako wersja robocza.";
}

// Przejście z podglądu do pola formularza, z którego pochodzi dany fragment raportu.
function gotoField(path) {
  const issue = path.match(/^issues\.(\d+)\.(\w+)$/);
  if (issue) {
    gotoIssue(Number(issue[1]));
    const field = $(`issue-${issue[1]}-${issue[2]}`);
    field?.focus();
    field?.scrollIntoView({ block: "center" });
    announce("Przeniesiono do pola w formularzu problemu. Po poprawce wróć do kroku „Podgląd i pobieranie”.");
    return;
  }
  const ids = { "summary.executiveSummary": ["summary", "executive-summary"], "summary.finalRecommendation": ["summary", "final-recommendation"], "summary.disclaimer": ["summary", "disclaimer"], "meta.auditScope": ["views", "audit-scope"] };
  const [step, id] = ids[path] || [];
  if (!step) return;
  showStep(STEPS.indexOf(step), false);
  $(id)?.focus();
  $(id)?.scrollIntoView({ block: "center" });
  announce("Przeniesiono do pola w formularzu. Po poprawce wróć do kroku „Podgląd i pobieranie”.");
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function announce(message, isError = false) {
  const region = $("status-region");
  region.classList.toggle("is-error", isError);
  region.textContent = "";
  requestAnimationFrame(() => { region.textContent = message; });
}
