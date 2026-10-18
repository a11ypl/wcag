// Raport w Markdown (CommonMark + tabele GFM).

import { buildDocument, SECTIONS } from "./document.js";
import { parseImageDataUrl } from "./text.js";

const escapeInline = (value) => String(value ?? "").replace(/([\\`*_[\]<>#|])/g, "\\$1");

function runs(items) {
  return items.map((run) => {
    let out = escapeInline(run.text);
    if (run.href) out = run.text.trim() === run.href ? `<${run.href}>` : `[${out}](${run.href.replace(/\)/g, "%29")})`;
    else if (run.anchor) out = `[${out}](#${run.anchor})`;
    if (run.bold && out.trim()) out = `**${out}**`;
    return out;
  }).join("").replace(/\n/g, "  \n");
}

const cell = (value) => (typeof value === "string" ? escapeInline(value) : runs(value)).replace(/\s*\n\s*/g, " ") || " ";

export function renderReportMarkdown(report) {
  const doc = buildDocument(report);
  const out = [`# ${escapeInline(doc.title)}`, "", doc.entity ? `${escapeInline(doc.subtitle)}: ${escapeInline(doc.entity)}` : escapeInline(doc.subtitle), ""];
  let tocDone = false;
  for (const block of doc.blocks) {
    if (block.type === "heading" && block.level === 2 && !tocDone) {
      out.push("## Spis treści", "", ...SECTIONS.map(([, label], index) => `${index + 1}. ${label}`), "");
      tocDone = true;
    }
    out.push(...renderBlock(block), "");
  }
  out.push("---", "", escapeInline(doc.footer), "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

function renderBlock(block) {
  switch (block.type) {
    case "note":
      return [`> **${escapeInline(block.title)}**`, ">", `> ${escapeInline(block.intro)}`, ">", ...block.items.map((item) => `> - ${escapeInline(item)}`)];
    case "heading":
      // Jawna kotwica, bo automatyczne identyfikatory nagłówków różnią się między przeglądarkami Markdown.
      return [...(/^problem-\d+$|^grupa-/.test(block.id) ? [`<a id="${block.id}"></a>`, ""] : []), `${"#".repeat(block.level)} ${escapeInline(block.text)}`];
    case "para":
      return [runs(block.runs)];
    case "list":
      return block.items.map((item, index) => `${block.ordered ? `${index + 1}.` : "-"} ${runs(item)}`);
    case "fields":
      return block.rows.map(([label, value]) => `- **${escapeInline(label)}:** ${runs(value)}`);
    case "table":
      return [
        `**Tabela: ${escapeInline(block.caption)}**`,
        "",
        `| ${block.headers.map(cell).join(" | ")} |`,
        `| ${block.headers.map(() => "---").join(" | ")} |`,
        ...block.rows.map((row, r) => `| ${row.map((value, c) => (c === 0 && block.rowIds?.[r] ? `<a id="${block.rowIds[r]}"></a>` : "") + cell(value)).join(" | ")} |`),
      ];
    case "code": {
      const fence = block.code.includes("```") ? "````" : "```";
      return [`Kod (${escapeInline(block.language.toUpperCase())}): ${escapeInline(block.label)}`, "", `${fence}${block.language.replace(/[^\w-]/g, "")}`, block.code, fence];
    }
    case "image": {
      const image = parseImageDataUrl(block.dataUrl);
      if (!image) return [`Nie można osadzić obrazu: ${escapeInline(block.fileName || "nieprawidłowe dane")}.`];
      const decorative = block.decorative || block.isDecorative;
      const alt = decorative ? "" : String(block.alt || "").replace(/[[\]\n]/g, " ");
      const lines = [`![${alt}](data:image/${image.type};base64,${image.base64})`];
      if (String(block.caption || "").trim()) lines.push("", `*${escapeInline(block.caption.trim())}*`);
      return lines;
    }
    default:
      return [];
  }
}
