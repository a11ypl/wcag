// Wspólne funkcje tekstowe dla rendererów HTML, Markdown i DOCX.

const MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

export function text(value, fallback = "Nie podano") {
  const rendered = String(value ?? "").trim();
  return rendered || fallback;
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

export function escapeXml(value) {
  // Usuwa znaki sterujące niedozwolone w XML 1.0, żeby DOCX zawsze się otwierał.
  return escapeHtml(String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, ""));
}

export function cleanList(items) {
  return (Array.isArray(items) ? items : []).map((item) => String(item ?? "").trim()).filter(Boolean);
}

// „2026-10-01” → „1 października 2026”. Inne wartości zwraca bez zmian.
export function formatDate(value, fallback = "Nie podano") {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw || fallback;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : raw;
}

export function formatPeriod(meta) {
  const start = String(meta?.auditStartDate || "").trim();
  const end = String(meta?.auditEndDate || "").trim();
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  return start || end ? formatDate(start || end) : "Nie podano";
}

export function isSafeUrl(value) {
  return /^https?:\/\/[^\s<>"]+$/i.test(String(value ?? "").trim());
}

const IMAGE_DATA_URL = /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=\s]+)$/;

export function parseImageDataUrl(value) {
  const match = String(value ?? "").match(IMAGE_DATA_URL);
  if (!match) return null;
  return { type: match[1] === "jpg" ? "jpeg" : match[1], base64: match[2].replace(/\s+/g, "") };
}

export function slug(value, fallback = "sekcja") {
  const map = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };
  const normalized = String(value ?? "").toLowerCase().replace(/[ąćęłńóśźż]/g, (ch) => map[ch]);
  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || fallback;
}

export function langCode(value) {
  return String(value || "pl-PL").split("-")[0].toLowerCase() || "pl";
}

export function fileBaseName(report) {
  const entity = slug(report?.meta?.auditedEntity || report?.meta?.websiteUrl || "", "");
  const meta = report?.meta || {};
  const date = String(meta.auditEndDate || meta.auditStartDate || meta.auditDate || "").trim();
  return ["raport-dostepnosci", entity, date].filter(Boolean).join("-");
}
