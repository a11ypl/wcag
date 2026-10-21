// Samodzielny dokument HTML raportu. Ten sam plik jest źródłem wersji PDF (druk z przeglądarki).

import { buildDocument, SECTIONS } from "./document.js";
import { escapeHtml, langCode, parseImageDataUrl } from "./text.js";

const STYLE = `
:root { color-scheme: light; --ink: #17262d; --muted: #4a5d65; --paper: #fffdf7; --line: #9fb0b6; --accent: #075f66; --head: #dcebed; --warn: #7b2d19; --warn-bg: #fff4ef; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; color: var(--ink); background: #f1efe8; font: 1rem/1.6 "Segoe UI", Aptos, Roboto, "Helvetica Neue", Arial, sans-serif; overflow-wrap: break-word; }
.skip-link { position: absolute; left: 1rem; top: -10rem; padding: .6rem 1rem; background: var(--ink); color: #fff; z-index: 2; }
.skip-link:focus { top: 1rem; }
header, main, footer { width: min(70rem, calc(100% - 2rem)); margin-inline: auto; }
header { padding: 2.5rem 0 1.5rem; }
header p { margin: 0; color: var(--muted); }
main { background: var(--paper); padding: clamp(1rem, 4vw, 3rem); border: 1px solid var(--line); }
h1, h2, h3, h4, h5 { line-height: 1.25; }
h5 { font-size: 1rem; margin: 1.2rem 0 .3rem; }
tr:target { outline: 3px solid #b44b20; outline-offset: -3px; }
h1 { font-size: clamp(1.8rem, 4.5vw, 3rem); margin: .4rem 0; }
h2 { margin-top: 1.5rem; padding-bottom: .3rem; border-bottom: 2px solid var(--accent); }
h3 { margin-top: 2rem; }
h4 { margin: 1.4rem 0 .4rem; }
a { color: #005a72; text-decoration-thickness: .1em; text-underline-offset: .15em; }
a:focus-visible { outline: 3px solid #b44b20; outline-offset: 3px; }
table { width: 100%; border-collapse: collapse; margin: 1rem 0 1rem; }
caption { text-align: left; font-weight: 700; padding-bottom: .4rem; }
th, td { border: 1px solid var(--line); padding: .5rem .65rem; text-align: left; vertical-align: top; }
thead th { background: var(--head); }
tbody th { font-weight: 600; }
.table-wrap { overflow-x: auto; }
dl.fields { display: grid; grid-template-columns: minmax(10rem, 1fr) 3fr; gap: .35rem 1rem; margin: 1rem 0; }
dl.fields dt { font-weight: 700; }
dl.fields dd { margin: 0; }
pre { overflow: auto; padding: 1rem; background: #17262d; color: #fffdf7; border-radius: .25rem; white-space: pre-wrap; }
code { font-family: Consolas, "Courier New", monospace; }
figure { margin: 1.5rem 0; }
figcaption { margin-top: .4rem; color: var(--muted); }
img { display: block; max-width: 100%; height: auto; border: 1px solid var(--line); }
.draft-note { border: 3px solid var(--warn); background: var(--warn-bg); padding: .5rem 1.25rem 1rem; }
.draft-note h2 { border: 0; margin-top: .75rem; color: var(--warn); }
footer { padding: 1.5rem 0 3rem; color: var(--muted); }
@media (max-width: 40rem) { dl.fields { grid-template-columns: 1fr; } dl.fields dd { margin-bottom: .6rem; } }
@media print {
  @page { size: A4; margin: 18mm 16mm; }
  body { background: #fff; font-size: 10.5pt; }
  .skip-link { display: none; }
  header, main, footer { width: auto; }
  main { border: 0; padding: 0; }
  h2, h3, h4 { break-after: avoid; }
  tr, figure, pre, dl.fields { break-inside: avoid; }
  thead { display: table-header-group; }
  a { color: inherit; }
}
`;

// options.editable — wersja do podglądu w generatorze: fragmenty mają data-edit ze ścieżką pola formularza.
let EDITABLE = false;
const editAttr = (block) => (EDITABLE && block.edit ? ` data-edit="${escapeHtml(block.edit)}"` : "");

export function renderReportHtml(report, options = {}) {
  EDITABLE = Boolean(options.editable);
  const doc = buildDocument(report);
  const toc = SECTIONS.map(([id, label]) => `<li><a href="#${id}">${escapeHtml(label)}</a></li>`).join("");
  const sections = [];
  let open = false;
  let body = "";
  for (const block of doc.blocks) {
    if (block.type === "note") {
      body += renderNote(block);
      continue;
    }
    if (block.type === "heading" && block.level === 2) {
      if (open) sections.push(`${body}</section>`);
      else sections.push(body);
      body = `<section aria-labelledby="${escapeHtml(block.id)}">${renderBlock(block)}`;
      open = true;
      continue;
    }
    body += renderBlock(block);
  }
  sections.push(open ? `${body}</section>` : body);
  const [beforeToc, ...rest] = sections;

  return `<!doctype html>
<html lang="${escapeHtml(langCode(doc.lang))}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(doc.entity ? `${doc.title} — ${doc.entity}` : doc.title)}</title>
${doc.authors.length ? `<meta name="author" content="${escapeHtml(doc.authors.join(", "))}">` : ""}
<meta name="generator" content="Generator raportów dostępności A11y First">
<style>${STYLE}${EDITABLE ? "[data-edit]{cursor:pointer;border-radius:.2rem}[data-edit]:hover{outline:2px dashed #5f28b4;outline-offset:3px}" : ""}</style>
</head>
<body>
<a class="skip-link" href="#tresc">Przejdź do treści raportu</a>
<header>
<p>${escapeHtml(doc.subtitle)}</p>
<h1>${escapeHtml(doc.title)}</h1>
${doc.entity ? `<p>${escapeHtml(doc.entity)}</p>` : ""}
</header>
<main id="tresc" tabindex="-1">
${beforeToc}
<nav aria-labelledby="spis-tresci"><h2 id="spis-tresci">Spis treści</h2><ol>${toc}</ol></nav>
${rest.join("\n")}
</main>
<footer><p>${escapeHtml(doc.footer)}</p></footer>
</body>
</html>
`;
}

function renderNote(block) {
  return `<aside class="draft-note" aria-labelledby="wersja-robocza"><h2 id="wersja-robocza">${escapeHtml(block.title)}</h2><p>${escapeHtml(block.intro)}</p><ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></aside>`;
}

function renderRuns(runs) {
  return runs.map((run) => {
    let html = escapeHtml(run.text);
    if (run.href) html = `<a href="${escapeHtml(run.href)}">${html}</a>`;
    else if (run.anchor) html = `<a href="#${escapeHtml(run.anchor)}">${html}</a>`;
    if (run.bold) html = `<strong>${html}</strong>`;
    return html;
  }).join("");
}

function renderCell(cell) {
  return typeof cell === "string" ? escapeHtml(cell) : renderRuns(cell);
}

function renderBlock(block) {
  switch (block.type) {
    case "heading":
      return `<h${block.level} id="${escapeHtml(block.id)}"${editAttr(block)}>${escapeHtml(block.text)}</h${block.level}>`;
    case "para":
      return `<p${editAttr(block)}>${renderRuns(block.runs).replace(/\n/g, "<br>")}</p>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}${editAttr(block)}>${block.items.map((item) => `<li>${renderRuns(item)}</li>`).join("")}</${tag}>`;
    }
    case "fields":
      return `<dl class="fields">${block.rows.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${renderRuns(value)}</dd>`).join("")}</dl>`;
    case "table": {
      const head = block.headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("");
      const rows = block.rows.map((row, r) => `<tr${block.rowIds?.[r] ? ` id="${escapeHtml(block.rowIds[r])}"` : ""}>${row.map((cell, index) => (index === 0 && block.rowHeaders ? `<th scope="row">${renderCell(cell)}</th>` : `<td>${renderCell(cell)}</td>`)).join("")}</tr>`).join("");
      return `<div class="table-wrap"><table><caption>${escapeHtml(block.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    case "code":
      return `<figure><figcaption>Kod (${escapeHtml(block.language.toUpperCase())}): ${escapeHtml(block.label)}</figcaption><pre><code>${escapeHtml(block.code)}</code></pre></figure>`;
    case "image": {
      const image = parseImageDataUrl(block.dataUrl);
      if (!image) return `<p>Nie można osadzić obrazu: ${escapeHtml(block.fileName || "nieprawidłowe dane")}.</p>`;
      const alt = block.decorative || block.isDecorative ? "" : String(block.alt || "");
      const size = block.width && block.height ? ` width="${Number(block.width)}" height="${Number(block.height)}"` : "";
      const caption = String(block.caption || "").trim();
      return `<figure><img src="data:image/${image.type};base64,${image.base64}" alt="${escapeHtml(alt)}"${size}>${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
    }
    default:
      return "";
  }
}
