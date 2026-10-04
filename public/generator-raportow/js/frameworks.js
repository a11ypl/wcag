// Standardy, względem których można prowadzić audyt, i ich przełożenie na listę wymagań.
// Każdy standard dla stron internetowych opiera się na kryteriach WCAG; część dodaje własne wymagania.
//
// UWAGA dla redakcji merytorycznej: tytuły wymagań dodatkowych EN 301 549 i BITV są polskimi
// opisami roboczymi, nie tekstem normy — do sprawdzenia z PN-EN 301 549 i tekstem BITV 2.0.

import { criteriaFor } from "./criteria.js";

const EN_EXTRA_V3 = {
  media: {
    label: "Odtwarzacz multimediów (rozdział 7)",
    hint: "Gdy serwis ma własny odtwarzacz wideo lub audio.",
    items: [
      ["7.1.1", "Odtwarzanie napisów"],
      ["7.1.2", "Synchronizacja napisów"],
      ["7.1.3", "Zachowanie napisów przy konwersji"],
      ["7.1.4", "Właściwości napisów (możliwość dostosowania wyglądu)"],
      ["7.1.5", "Napisy mówione"],
      ["7.2.1", "Odtwarzanie audiodeskrypcji"],
      ["7.2.2", "Synchronizacja audiodeskrypcji"],
      ["7.2.3", "Zachowanie audiodeskrypcji przy konwersji"],
      ["7.3", "Sterowanie napisami i audiodeskrypcją przez użytkownika"],
    ],
  },
  docs: {
    label: "Dokumentacja i wsparcie (rozdział 12)",
    hint: "Gdy oceniasz też instrukcje, pomoc techniczną lub obsługę klienta.",
    items: [
      ["12.1.1", "Opis funkcji ułatwień dostępu i kompatybilności w dokumentacji"],
      ["12.1.2", "Dostępna forma dokumentacji"],
      ["12.2.2", "Informacje o funkcjach ułatwień dostępu w usługach wsparcia"],
      ["12.2.3", "Skuteczna komunikacja z użytkownikiem w usługach wsparcia"],
      ["12.2.4", "Dostępna dokumentacja przekazywana przez usługi wsparcia"],
    ],
  },
  features: {
    label: "Funkcje ułatwień dostępu (rozdział 5)",
    hint: "Gdy produkt ma własne tryby dostępności lub logowanie biometryczne.",
    items: [
      ["5.2", "Uruchamianie funkcji ułatwień dostępu"],
      ["5.3", "Biometria — dostępna alternatywa"],
      ["5.4", "Zachowanie informacji o dostępności przy konwersji"],
    ],
  },
};

const BITV_EXTRA = {
  bitv: {
    label: "Wymagania własne BITV 2.0",
    hint: "Obowiązkowe dla niemieckich podmiotów publicznych.",
    items: [
      ["§4 DGS", "Informacje na stronie startowej w niemieckim języku migowym (DGS)"],
      ["§4 LS", "Informacje na stronie startowej w języku łatwym (Leichte Sprache)"],
      ["§7 Erklärung", "Deklaracja dostępności (Erklärung zur Barrierefreiheit)"],
      ["§7 Feedback", "Mechanizm zgłaszania barier (Feedback-Mechanismus)"],
    ],
  },
};

const PL_EXTRA = {
  pl: {
    label: "Wymagania ustawy o dostępności cyfrowej (sektor publiczny)",
    hint: "Elementy, które ustawa wymaga obok zgodności z normą.",
    items: [
      ["art. 10", "Deklaracja dostępności — aktualna i zgodna z wymaganym wzorem"],
      ["art. 18", "Możliwość zgłoszenia żądania zapewnienia dostępności"],
    ],
  },
};

export const FRAMEWORKS = {
  wcag: {
    label: "WCAG",
    long: "Web Content Accessibility Guidelines (W3C)",
    hint: "Międzynarodowy standard dostępności treści internetowych. Wybierz, gdy klient nie wskazał innego standardu albo audyt jest dobrowolny.",
    versions: {
      "2.2": { label: "WCAG 2.2 (2023)", wcag: "WCAG 2.2", hint: "Najnowsza zalecana wersja. Zawiera 86 kryteriów, w tym 9 nowych względem 2.1." },
      "2.1": { label: "WCAG 2.1 (2018)", wcag: "WCAG 2.1", hint: "Wersja, do której odwołuje się EN 301 549 V3.2.1 i polska ustawa o dostępności cyfrowej." },
      "2.0": { label: "WCAG 2.0 (2008)", wcag: "WCAG 2.0", hint: "Starsza wersja, do której odwołuje się m.in. amerykańska Section 508." },
      "3.0": { label: "WCAG 3.0 (szkic roboczy)", disabled: true, hint: "Wersja robocza W3C. Nie ma poziomów A/AA/AAA ani stabilnych kryteriów, więc nie może być podstawą oceny zgodności." },
    },
    levels: ["A", "AA", "AAA"],
    defaultVersion: "2.2",
  },
  en301549: {
    label: "EN 301 549",
    long: "Europejska norma wymagań dostępności produktów i usług ICT",
    hint: "Norma zharmonizowana w UE. Do niej odwołuje się polska ustawa o dostępności cyfrowej i Europejski akt o dostępności.",
    versions: {
      "3.2.1": { label: "V3.2.1 (2021)", wcag: "WCAG 2.1", extras: EN_EXTRA_V3, hint: "Wersja obowiązująca dla podmiotów publicznych. Rozdział 9 (strony internetowe) odpowiada WCAG 2.1 na poziomie AA." },
      "4.1.1": { label: "V4.1.1", wcag: "WCAG 2.2", extras: EN_EXTRA_V3, hint: "Nowa wersja przygotowana pod Europejski akt o dostępności, oparta na WCAG 2.2 na poziomie AA. Sprawdź, czy klient wymaga już tej wersji." },
    },
    fixedLevel: "AA",
    levelNote: "EN 301 549 wymaga spełnienia kryteriów WCAG na poziomach A i AA.",
    prefix: "9.",
    defaultVersion: "3.2.1",
  },
  section508: {
    label: "Section 508",
    long: "Amerykańskie wymagania dostępności ICT dla administracji federalnej",
    hint: "Wybierz, gdy produkt jest kierowany do instytucji federalnych w USA.",
    versions: {
      "2017": { label: "Revised 508 Standards (2017)", wcag: "WCAG 2.0", hint: "Treści internetowe muszą spełniać WCAG 2.0 na poziomie AA." },
    },
    fixedLevel: "AA",
    levelNote: "Section 508 wymaga spełnienia WCAG 2.0 na poziomach A i AA.",
    defaultVersion: "2017",
  },
  bitv: {
    label: "BITV",
    long: "Barrierefreie-Informationstechnik-Verordnung (Niemcy)",
    hint: "Niemieckie rozporządzenie dla podmiotów publicznych. Odwołuje się do EN 301 549 i dodaje własne wymagania.",
    versions: {
      "2.0": { label: "BITV 2.0 (2019)", wcag: "WCAG 2.1", extras: { ...BITV_EXTRA, ...EN_EXTRA_V3 }, hint: "Wymaga EN 301 549 V3.2.1 (WCAG 2.1 AA) oraz informacji w DGS i Leichte Sprache." },
    },
    fixedLevel: "AA",
    levelNote: "BITV 2.0 wymaga poziomów A i AA (przez EN 301 549).",
    defaultVersion: "2.0",
  },
  rgaa: {
    label: "RGAA",
    long: "Référentiel général d'amélioration de l'accessibilité (Francja)",
    hint: "Francuski referencjał dla podmiotów publicznych i dużych firm.",
    versions: {
      "4.1.2": { label: "RGAA 4.1.2 (2023)", wcag: "WCAG 2.1", hint: "Oparty na WCAG 2.1 AA. Generator używa listy kryteriów WCAG — własna siatka 106 kryteriów RGAA nie jest jeszcze dostępna." },
    },
    fixedLevel: "AA",
    levelNote: "RGAA odpowiada WCAG 2.1 na poziomach A i AA.",
    defaultVersion: "4.1.2",
  },
};

export function frameworkOf(meta) {
  return FRAMEWORKS[meta?.framework] || FRAMEWORKS.wcag;
}

export function versionOf(meta) {
  const framework = frameworkOf(meta);
  const version = framework.versions[meta?.frameworkVersion];
  return version && !version.disabled ? version : framework.versions[framework.defaultVersion];
}

// Ujednolica pola meta: framework, wersja, poziom i wynikowa wersja WCAG.
export function normalizeScope(meta) {
  if (!FRAMEWORKS[meta.framework]) {
    meta.framework = "wcag";
    meta.frameworkVersion = String(meta.standard || "WCAG 2.2").replace("WCAG ", "");
  }
  const framework = frameworkOf(meta);
  const version = versionOf(meta);
  meta.frameworkVersion = Object.keys(framework.versions).find((key) => framework.versions[key] === version);
  meta.standard = version.wcag;
  if (framework.fixedLevel) meta.conformanceLevel = framework.fixedLevel;
  else if (!framework.levels.includes(meta.conformanceLevel)) meta.conformanceLevel = "AA";
  // Dozwolone grupy: wymagania standardu oraz wymagania ustawy (sektor publiczny) — tak jak pokazuje kreator.
  const available = Object.keys(extraGroupsFor(meta));
  meta.extraGroups = (Array.isArray(meta.extraGroups) ? meta.extraGroups : []).filter((key) => available.includes(key));
  // Wymagania własne BITV są obowiązkowe, gdy wybrano BITV.
  if (meta.framework === "bitv" && !meta.extraGroups.includes("bitv")) meta.extraGroups.unshift("bitv");
  return meta;
}

export function extraGroupsFor(meta) {
  const version = versionOf(meta);
  const extras = { ...(version.extras || {}) };
  if (meta?.sector === "publiczny" && ["wcag", "en301549"].includes(meta.framework || "wcag")) Object.assign(extras, PL_EXTRA);
  return extras;
}

// Pełna lista wymagań dla zakresu: kryteria WCAG (z numeracją standardu) + wybrane wymagania dodatkowe.
export function requirementsFor(meta) {
  const framework = frameworkOf(meta);
  const version = versionOf(meta);
  const level = framework.fixedLevel || meta.conformanceLevel || "AA";
  const prefix = framework.prefix || "";
  const rows = criteriaFor(version.wcag, level).map((item) => ({ ...item, displayId: `${prefix}${item.id}`, group: item.principle }));
  const extras = extraGroupsFor(meta);
  for (const key of meta.extraGroups || []) {
    const group = extras[key];
    if (!group) continue;
    for (const [id, title] of group.items) {
      rows.push({ id: `${key}:${id}`, displayId: id, title, level: "—", principle: group.label, group: group.label, versions: [], extra: true });
    }
  }
  return rows;
}

export function scopeLabel(meta) {
  const framework = frameworkOf(meta);
  const version = versionOf(meta);
  const level = framework.fixedLevel || meta.conformanceLevel || "AA";
  if ((meta.framework || "wcag") === "wcag") return `${version.wcag}, poziom ${level}`;
  return `${framework.label} ${version.label} (${version.wcag}, poziom ${level})`;
}

// Podpowiedzi podstawy prawnej — klocki do wstawienia jednym kliknięciem.
export function legalBasisSuggestions(meta) {
  const list = [];
  const fw = meta?.framework || "wcag";
  if (meta?.sector === "publiczny" || fw === "en301549") {
    list.push("Ustawa z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych (Dz.U. 2019 poz. 848)");
    list.push("Dyrektywa Parlamentu Europejskiego i Rady (UE) 2016/2102 w sprawie dostępności stron internetowych i mobilnych aplikacji organów sektora publicznego");
  }
  if (meta?.sector === "prywatny" || fw === "en301549") {
    list.push("Ustawa z dnia 26 kwietnia 2024 r. o zapewnianiu spełniania wymagań dostępności niektórych produktów i usług przez podmioty gospodarcze (Dz.U. 2024 poz. 731)");
    list.push("Dyrektywa Parlamentu Europejskiego i Rady (UE) 2019/882 w sprawie wymogów dostępności produktów i usług (Europejski akt o dostępności)");
  }
  if (fw === "en301549" || fw === "bitv") list.push(`EN 301 549 ${versionOf({ ...meta, framework: "en301549", frameworkVersion: fw === "bitv" ? "3.2.1" : meta.frameworkVersion }).label} — Wymagania dostępności produktów i usług ICT`);
  if (fw === "section508") list.push("Section 508 of the Rehabilitation Act (29 U.S.C. § 794d), Revised 508 Standards (36 CFR Part 1194)");
  if (fw === "bitv") list.push("Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) w brzmieniu z 2019 r.");
  if (fw === "rgaa") list.push("Référentiel général d'amélioration de l'accessibilité (RGAA) 4.1.2");
  list.push(`${versionOf(meta).wcag} — Web Content Accessibility Guidelines, rekomendacja W3C`);
  return [...new Set(list)];
}
