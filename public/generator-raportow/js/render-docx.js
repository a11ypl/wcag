// Raport DOCX zapisany bezpośrednio w Office Open XML.
// Dostępność: prawdziwe style nagłówków (nawigacja i spis treści w Wordzie), listy z numeracji
// Worda, tabele z powtarzanym wierszem nagłówka i tytułem/opisem tabeli, hiperłącza, język
// dokumentu pl-PL, metadane (tytuł, autor), tekst alternatywny i znacznik obrazu dekoracyjnego.

import { buildDocument } from "./document.js";
import { escapeXml, parseImageDataUrl } from "./text.js";
import { createZip } from "./zip.js";

const NS = {
  w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
  r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
  a: "http://schemas.openxmlformats.org/drawingml/2006/main",
  pic: "http://schemas.openxmlformats.org/drawingml/2006/picture",
};
const REL = {
  hyperlink: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
  image: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
};
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const PAGE_WIDTH_TWIPS = 9638; // A4 minus marginesy 2 cm
const MAX_IMAGE_EMU = 6_120_000; // 17 cm
const EMU_PER_PX = 9525;
const HEADING_STYLE = { 2: "Heading1", 3: "Heading2", 4: "Heading3", 5: "Heading4" };

export const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function renderReportDocx(report, now = new Date()) {
  return new DocxBuilder(report, now).build();
}

class DocxBuilder {
  constructor(report, now) {
    this.report = report;
    this.now = now;
    this.doc = buildDocument(report);
    this.rels = [];
    this.media = [];
    this.orderedLists = 0;
    this.drawingId = 1;
  }

  build() {
    const body = this.bodyXml();
    const document = `${XML_HEAD}<w:document xmlns:w="${NS.w}" xmlns:r="${NS.r}" xmlns:wp="${NS.wp}" xmlns:a="${NS.a}" xmlns:pic="${NS.pic}"><w:body>${body}${sectionProperties()}</w:body></w:document>`;
    return createZip([
      { name: "[Content_Types].xml", data: contentTypesXml() },
      { name: "_rels/.rels", data: packageRelsXml() },
      { name: "docProps/core.xml", data: this.coreXml() },
      { name: "docProps/app.xml", data: appXml() },
      { name: "word/document.xml", data: document },
      { name: "word/_rels/document.xml.rels", data: this.relsXml() },
      { name: "word/styles.xml", data: stylesXml() },
      { name: "word/numbering.xml", data: this.numberingXml() },
      { name: "word/settings.xml", data: settingsXml() },
      ...this.media.map((item) => ({ name: `word/media/${item.name}`, data: item.bytes })),
    ], this.now);
  }

  bodyXml() {
    const doc = this.doc;
    const parts = [paragraph(doc.title, "Title"), paragraph(doc.subtitle, "Subtitle")];
    if (doc.entity) parts.push(paragraph(doc.entity, "Subtitle"));
    for (const block of doc.blocks) parts.push(this.block(block));
    parts.push(paragraph(doc.footer, "FooterNote"));
    return parts.join("");
  }

  block(block) {
    switch (block.type) {
      case "note":
        return [paragraph(block.title, "Heading1"), paragraph(block.intro), ...block.items.map((item) => paragraphRuns([run(item)], "ListParagraph", 1))].join("");
      case "heading":
        return paragraph(block.text, HEADING_STYLE[block.level] || "Heading3", null, block.id);
      case "para":
        return paragraphRuns(this.runs(block.runs));
      case "list": {
        const numId = block.ordered ? this.newOrderedList() : 1;
        return block.items.map((item) => paragraphRuns(this.runs(item), "ListParagraph", numId)).join("");
      }
      case "fields":
        return this.table(block.label, ["Pole", "Wartość"], block.rows.map(([label, value]) => [label, value]), true, [2900, PAGE_WIDTH_TWIPS - 2900]);
      case "table":
        return this.table(block.caption, block.headers, block.rows, block.rowHeaders, columnWidths(block.headers), block.rowIds);
      case "code":
        return paragraph(`Kod (${block.language.toUpperCase()}): ${block.label}`, "Caption") + codeParagraph(block.code);
      case "image":
        return this.image(block);
      default:
        return "";
    }
  }

  runs(runs) {
    return runs.map((item) => {
      if (item.anchor) return `<w:hyperlink w:anchor="${escapeXml(bookmarkName(item.anchor))}" w:history="1">${run(item.text, { bold: item.bold, style: "Hyperlink" })}</w:hyperlink>`;
      if (!item.href) return run(item.text, { bold: item.bold });
      const id = this.addRel(REL.hyperlink, item.href, true);
      return `<w:hyperlink r:id="${id}" w:history="1">${run(item.text, { bold: item.bold, style: "Hyperlink" })}</w:hyperlink>`;
    }).join("");
  }

  table(caption, headers, rows, rowHeaders, widths = columnWidths(headers), rowIds = []) {
    const grid = widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("");
    const headerRow = `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${headers.map((header, index) => cell(this, [{ text: header, bold: true }], widths[index], "DCEBED")).join("")}</w:tr>`;
    const bodyRows = rows.map((row, r) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${headers.map((_, index) => {
      const value = row[index] ?? "";
      const runs = typeof value === "string" ? [{ text: value, bold: rowHeaders && index === 0 }] : value.map((item) => ({ ...item, bold: item.bold || (rowHeaders && index === 0) }));
      return cell(this, runs, widths[index], null, index === 0 ? rowIds[r] : null);
    }).join("")}</w:tr>`).join("");
    return paragraph(caption, "Caption", null, null, true)
      + `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="${PAGE_WIDTH_TWIPS}" w:type="dxa"/>`
      + `<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="${rowHeaders ? 1 : 0}" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>`
      + `<w:tblCaption w:val="${escapeXml(caption)}"/><w:tblDescription w:val="${escapeXml(`Tabela: ${caption}. Pierwszy wiersz zawiera nagłówki kolumn.`)}"/>`
      + `</w:tblPr><w:tblGrid>${grid}</w:tblGrid>${headerRow}${bodyRows}</w:tbl>`
      + paragraph("", "Normal");
  }

  image(block) {
    const parsed = parseImageDataUrl(block.dataUrl);
    if (!parsed) return paragraph(`Nie można osadzić obrazu: ${block.fileName || "nieprawidłowe dane"}.`);
    const extension = parsed.type === "jpeg" ? "jpg" : parsed.type;
    const name = `image-${this.media.length + 1}.${extension}`;
    this.media.push({ name, bytes: base64ToBytes(parsed.base64) });
    const relId = this.addRel(REL.image, `media/${name}`, false);
    const id = this.drawingId++;
    const decorative = Boolean(block.decorative || block.isDecorative);
    const alt = decorative ? "" : String(block.alt || "");
    const [cx, cy] = imageExtent(block.width, block.height);
    const decorativeExt = decorative
      ? '<a:extLst><a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}"><adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="1"/></a:ext></a:extLst>'
      : "";
    const title = escapeXml(block.fileName || name);
    const drawing = `<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/>`
      + `<wp:docPr id="${id}" name="${title}" descr="${escapeXml(alt)}">${decorativeExt}</wp:docPr>`
      + '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>'
      + `<a:graphic><a:graphicData uri="${NS.pic}"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="${title}" descr="${escapeXml(alt)}"/><pic:cNvPicPr/></pic:nvPicPr>`
      + `<pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`
      + `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>`
      + "</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>";
    const caption = String(block.caption || "").trim();
    return `<w:p><w:pPr><w:pStyle w:val="Normal"/><w:keepNext/></w:pPr><w:r>${drawing}</w:r></w:p>${caption ? paragraph(caption, "Caption") : ""}`;
  }

  newOrderedList() {
    this.orderedLists += 1;
    return 100 + this.orderedLists;
  }

  addRel(type, target, external) {
    const id = `rId${this.rels.length + 10}`;
    this.rels.push({ id, type, target, external });
    return id;
  }

  relsXml() {
    const fixed = [
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>',
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>',
    ];
    const dynamic = this.rels.map((rel) => `<Relationship Id="${rel.id}" Type="${rel.type}" Target="${escapeXml(rel.target)}"${rel.external ? ' TargetMode="External"' : ""}/>`);
    return `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${[...fixed, ...dynamic].join("")}</Relationships>`;
  }

  numberingXml() {
    const level = (format, text) => `<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${format}"/><w:lvlText w:val="${text}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>`;
    const ordered = Array.from({ length: this.orderedLists }, (_, index) => `<w:num w:numId="${101 + index}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`).join("");
    return `${XML_HEAD}<w:numbering xmlns:w="${NS.w}">`
      + `<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/>${level("bullet", "•")}</w:abstractNum>`
      + `<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/>${level("decimal", "%1.")}</w:abstractNum>`
      + `<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>${ordered}</w:numbering>`;
  }

  coreXml() {
    const created = this.now.toISOString().replace(/\.\d{3}Z$/, "Z");
    const doc = this.doc;
    return `${XML_HEAD}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`
      + `<dc:title>${escapeXml(doc.entity ? `${doc.title} — ${doc.entity}` : doc.title)}</dc:title>`
      + `<dc:subject>${escapeXml(doc.subtitle)}</dc:subject>`
      + `<dc:creator>${escapeXml(doc.authors.join(", "))}</dc:creator>`
      + "<cp:keywords>dostępność cyfrowa, WCAG, audyt</cp:keywords>"
      + `<dc:language>${escapeXml(doc.lang)}</dc:language>`
      + `<dcterms:created xsi:type="dcterms:W3CDTF">${created}</dcterms:created>`
      + `<dcterms:modified xsi:type="dcterms:W3CDTF">${created}</dcterms:modified>`
      + "</cp:coreProperties>";
  }
}

function run(textValue, { bold = false, style = null } = {}) {
  const props = `${style ? `<w:rStyle w:val="${style}"/>` : ""}${bold ? "<w:b/>" : ""}`;
  const lines = String(textValue ?? "").split("\n");
  const content = lines.map((line, index) => `${index ? "<w:br/>" : ""}<w:t xml:space="preserve">${escapeXml(line)}</w:t>`).join("");
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}${content}</w:r>`;
}

function paragraphRuns(runs, style = "Normal", numId = null, bookmark = null, keepNext = false) {
  const numbering = numId ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr>` : "";
  const props = `<w:pPr><w:pStyle w:val="${style}"/>${keepNext ? "<w:keepNext/>" : ""}${numbering}</w:pPr>`;
  const content = Array.isArray(runs) ? runs.join("") : runs;
  if (!bookmark) return `<w:p>${props}${content}</w:p>`;
  const id = bookmarkId(bookmark);
  return `<w:p>${props}<w:bookmarkStart w:id="${id}" w:name="${escapeXml(bookmarkName(bookmark))}"/>${content}<w:bookmarkEnd w:id="${id}"/></w:p>`;
}

function paragraph(textValue, style = "Normal", numId = null, bookmark = null, keepNext = false) {
  return paragraphRuns([run(textValue)], style, numId, bookmark, keepNext);
}

let bookmarkCounter = 0;
function bookmarkId() {
  bookmarkCounter = (bookmarkCounter + 1) % 100000;
  return bookmarkCounter;
}

// Nazwa zakładki w Wordzie: litera na początku, maks. 40 znaków, bez myślników.
function bookmarkName(id) {
  return `_${String(id).replace(/[^A-Za-z0-9_]/g, "_")}`.slice(0, 40);
}

function cell(builder, runs, width, fill = null, bookmark = null) {
  const shading = fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : "";
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${shading}</w:tcPr>${paragraphRuns(builder.runs(runs), "TableText", null, bookmark)}</w:tc>`;
}

function codeParagraph(code) {
  const lines = String(code ?? "").split(/\r?\n/);
  return paragraphRuns([run(lines.join("\n"))], "Code");
}

function columnWidths(headers) {
  const weights = headers.map((header, index) => (/komentarz/i.test(header) ? 3 : index === 0 ? 2.4 : /poziom|liczba/i.test(header) ? 0.7 : /problemy/i.test(header) ? 1.1 : 1));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const widths = weights.map((weight) => Math.floor((weight / total) * PAGE_WIDTH_TWIPS));
  widths[widths.length - 1] += PAGE_WIDTH_TWIPS - widths.reduce((sum, width) => sum + width, 0);
  return widths;
}

function imageExtent(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (!(w > 0 && h > 0)) return [5_250_000, 3_150_000];
  let cx = Math.round(w * EMU_PER_PX);
  let cy = Math.round(h * EMU_PER_PX);
  if (cx > MAX_IMAGE_EMU) {
    cy = Math.round((cy * MAX_IMAGE_EMU) / cx);
    cx = MAX_IMAGE_EMU;
  }
  return [cx, cy];
}

function base64ToBytes(base64) {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function sectionProperties() {
  return '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>';
}

function contentTypesXml() {
  return `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="webp" ContentType="image/webp"/>'
    + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    + '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
    + '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>'
    + '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>'
    + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
    + '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
    + "</Types>";
}

function packageRelsXml() {
  return `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
    + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
    + "</Relationships>";
}

function appXml() {
  return `${XML_HEAD}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">`
    + "<Application>Generator raportów dostępności A11y First</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop>"
    + "<LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>";
}

function settingsXml() {
  return `${XML_HEAD}<w:settings xmlns:w="${NS.w}"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/>`
    + '<w:characterSpacingControl w:val="doNotCompress"/>'
    + '<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>'
    + '<w:themeFontLang w:val="pl-PL" w:eastAsia="pl-PL"/></w:settings>';
}

function headingStyle(id, name, outline, size, color) {
  return `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/>`
    + `<w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="320" w:after="120"/><w:outlineLvl w:val="${outline}"/></w:pPr>`
    + `<w:rPr><w:b/><w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr></w:style>`;
}

function stylesXml() {
  return `${XML_HEAD}<w:styles xmlns:w="${NS.w}">`
    + '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos" w:eastAsia="Aptos" w:cs="Aptos"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pl-PL" w:eastAsia="pl-PL" w:bidi="ar-SA"/></w:rPr></w:rPrDefault>'
    + '<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
    + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:color w:val="17262D"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Subtitle"/><w:qFormat/><w:pPr><w:spacing w:after="120"/></w:pPr><w:rPr><w:b/><w:color w:val="0B3F45"/><w:sz w:val="48"/><w:szCs w:val="48"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:rPr><w:color w:val="4A5D65"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>'
    + headingStyle("Heading1", "heading 1", 0, 32, "075F66")
    + headingStyle("Heading2", "heading 2", 1, 27, "173E46")
    + headingStyle("Heading3", "heading 3", 2, 23, "17262D")
    + headingStyle("Heading4", "heading 4", 3, 22, "17262D")
    + '<w:style w:type="paragraph" w:styleId="Caption"><w:name w:val="caption"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="35"/><w:qFormat/><w:pPr><w:spacing w:before="120" w:after="80"/></w:pPr><w:rPr><w:b/><w:color w:val="17262D"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="34"/><w:qFormat/><w:pPr><w:spacing w:after="60"/><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:shd w:val="clear" w:color="auto" w:fill="EEF2F3"/><w:spacing w:after="200" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:sz w:val="19"/><w:szCs w:val="19"/><w:lang w:val="en-US"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="FooterNote"><w:name w:val="Footer Note"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="480"/></w:pPr><w:rPr><w:color w:val="4A5D65"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>'
    + '<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rPr><w:color w:val="005A72"/><w:u w:val="single"/></w:rPr></w:style>'
    + '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
    + '<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="39"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="9FB0B6"/><w:left w:val="single" w:sz="4" w:space="0" w:color="9FB0B6"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="9FB0B6"/><w:right w:val="single" w:sz="4" w:space="0" w:color="9FB0B6"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="9FB0B6"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="9FB0B6"/></w:tblBorders><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
    + "</w:styles>";
}
