import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const archive = process.argv[2];
const outputDirectory = process.argv[3];

if (!archive || !outputDirectory) {
  throw new Error("Użycie: node scripts/render_plain_language_pages.mjs ARCHIWUM_ZIP KATALOG_PUBLIC");
}

const pages = [
  {
    source: "01_prosty-jezyk.md",
    output: "prosty-jezyk.html",
    eyebrow: "Baza wiedzy",
    type: "CollectionPage",
  },
  {
    source: "02_prosty-jezyk-wcag-3.md",
    output: "prosty-jezyk/wcag-3.html",
    eyebrow: "Prosty język",
    type: "Article",
  },
  {
    source: "03_prosty-jezyk-checklista.md",
    output: "prosty-jezyk/checklista.html",
    eyebrow: "Prosty język",
    type: "Article",
  },
  {
    source: "04_prosty-jezyk-cwiczenia.md",
    output: "prosty-jezyk/cwiczenia.html",
    eyebrow: "Prosty język",
    type: "Article",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .replace(/[ąćęłńóśźż]/gi, (character) => {
      const replacements = {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ź: "z",
        ż: "z",
      };
      const replacement = replacements[character.toLowerCase()];
      return character === character.toUpperCase()
        ? replacement.toUpperCase()
        : replacement;
    })
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderExternalLink(url, label) {
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> (otwiera się w nowym oknie)</span></a>`;
}

function renderInline(value) {
  const tokens = [];
  let text = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const token = `INLINE_TOKEN_${tokens.length}`;
    const escapedLabel = escapeHtml(label);
    tokens.push(
      /^https?:\/\//.test(url)
        ? renderExternalLink(url, escapedLabel)
        : `<a href="${escapeHtml(url)}">${escapedLabel}</a>`,
    );
    return token;
  });

  text = text.replace(/`([^`]+)`/g, (_, code) => {
    const token = `INLINE_TOKEN_${tokens.length}`;
    tokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  text = escapeHtml(text);
  tokens.forEach((token, index) => {
    text = text.replace(`INLINE_TOKEN_${index}`, token);
  });
  return text;
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Brak frontmatter w materiale");
  }

  const metadata = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    metadata[line.slice(0, separator).trim()] = line
      .slice(separator + 1)
      .trim()
      .replace(/^"|"$/g, "");
  }
  return { metadata, body: match[2] };
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = ['<article class="knowledge-panel knowledge-lead">'];
  let paragraph = [];
  let articleOpen = true;
  let listType = null;
  let blockquoteOpen = false;
  let quoteListOpen = false;
  const usedIds = new Map();

  const uniqueId = (title) => {
    const base = slugify(title);
    const count = (usedIds.get(base) || 0) + 1;
    usedIds.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const closeQuote = () => {
    if (quoteListOpen) {
      html.push("</ul>");
      quoteListOpen = false;
    }
    if (blockquoteOpen) {
      html.push("</blockquote>");
      blockquoteOpen = false;
    }
  };

  const closeFlow = () => {
    closeParagraph();
    closeList();
    closeQuote();
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^# /.test(line)) continue;

    if (trimmed.startsWith("```")) {
      closeFlow();
      const language = trimmed.slice(3).trim() || "text";
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      html.push(
        `<div class="wcag-code-example"><div class="wcag-code-example__code"><p class="wcag-code-example__label">Kod — ${escapeHtml(language.toUpperCase())}</p><pre><code class="language-${escapeHtml(language)}">${escapeHtml(code.join("\n"))}</code></pre></div></div>`,
      );
      continue;
    }

    const heading = line.match(/^(##|###) (.+)$/);
    if (heading) {
      closeFlow();
      const level = heading[1].length;
      const title = heading[2];
      const id = uniqueId(title);
      if (level === 2) {
        if (articleOpen) html.push("</article>");
        html.push(`<article class="knowledge-panel"><h2 id="${id}">${renderInline(title)}</h2>`);
        articleOpen = true;
      } else {
        html.push(`<h3 id="${id}">${renderInline(title)}</h3>`);
      }
      continue;
    }

    if (
      trimmed.startsWith("|") &&
      index + 1 < lines.length &&
      /^\s*\|?[\s:-]+\|/.test(lines[index + 1])
    ) {
      closeFlow();
      const headers = splitTableRow(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      index -= 1;
      const label = `Tabela: ${headers.join(", ")}`;
      html.push(
        `<div class="knowledge-table-wrapper" tabindex="0" role="region" aria-label="${escapeHtml(label)}"><table class="knowledge-table"><thead><tr>${headers.map((cell) => `<th scope="col">${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
      );
      continue;
    }

    if (trimmed.startsWith(">")) {
      closeParagraph();
      closeList();
      if (!blockquoteOpen) {
        html.push("<blockquote>");
        blockquoteOpen = true;
      }
      const quote = trimmed.replace(/^>\s?/, "");
      if (quote.startsWith("- ")) {
        if (!quoteListOpen) {
          html.push('<ul class="detail-list">');
          quoteListOpen = true;
        }
        html.push(`<li>${renderInline(quote.slice(2))}</li>`);
      } else if (quote) {
        if (quoteListOpen) {
          html.push("</ul>");
          quoteListOpen = false;
        }
        html.push(`<p>${renderInline(quote)}</p>`);
      }
      continue;
    }

    if (blockquoteOpen) closeQuote();

    const listItem = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (listItem) {
      closeParagraph();
      const requestedType = /\d+\./.test(listItem[2]) ? "ol" : "ul";
      if (listType !== requestedType) {
        closeList();
        html.push(`<${requestedType} class="detail-list">`);
        listType = requestedType;
      }

      let content = listItem[3];
      const nextLine = lines[index + 1]?.trim() || "";
      if (content.endsWith("  ") && /^https?:\/\//.test(nextLine)) {
        content = content.trimEnd();
        html.push(`<li>${renderExternalLink(nextLine, renderInline(content))}</li>`);
        index += 1;
      } else {
        html.push(`<li>${renderInline(content)}</li>`);
      }
      continue;
    }

    if (!trimmed) {
      if (listType) {
        let lookahead = index + 1;
        while (lookahead < lines.length && !lines[lookahead].trim()) {
          lookahead += 1;
        }
        const nextItem = lines[lookahead]?.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
        const nextType = nextItem && /\d+\./.test(nextItem[2]) ? "ol" : nextItem ? "ul" : null;
        if (nextType === listType) continue;
      }
      closeFlow();
      continue;
    }

    paragraph.push(trimmed);
  }

  closeFlow();
  if (articleOpen) html.push("</article>");
  return html.join("\n");
}

function renderResourceNavigation(currentSlug) {
  const links = [
    ["/prosty-jezyk", "Wprowadzenie do prostego języka"],
    ["/prosty-jezyk/wcag-3", "ISO 24495 i kierunek WCAG 3"],
    ["/prosty-jezyk/checklista", "Checklista prostego języka"],
    ["/prosty-jezyk/cwiczenia", "Ćwiczenia z prostego języka"],
  ];
  return `<nav class="plain-language-nav" aria-label="Części zasobu o prostym języku"><h2>Przejdź do innej części zasobu</h2><ul>${links
    .map(([href, label]) =>
      href === currentSlug
        ? `<li><span aria-current="page">${label}</span></li>`
        : `<li><a href="${href}">${label}</a></li>`,
    )
    .join("")}</ul></nav>`;
}

function renderBreadcrumbs(slug, title) {
  const child = slug !== "/prosty-jezyk";
  return `<nav class="breadcrumbs" aria-label="Ścieżka okruszków"><ol><li><a href="/">Strona główna</a></li><li><a href="/baza-wiedzy">Baza wiedzy</a></li>${
    child ? '<li><a href="/prosty-jezyk">Prosty język</a></li>' : ""
  }<li aria-current="page">${escapeHtml(child ? title : "Prosty język")}</li></ol></nav>`;
}

function renderPage(page, metadata, content) {
  const title = metadata.title;
  const description = metadata.description;
  const slug = metadata.slug;
  const assetPrefix = page.output.includes("/") ? "../assets" : "assets";
  const canonical = `https://www.a11yfirst.pl${slug}`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": page.type,
    name: title,
    headline: title,
    description,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "Accessibility First",
      url: "https://www.a11yfirst.pl",
    },
    publisher: {
      "@type": "Organization",
      name: "Włącz Wizję sp. z o.o.",
      url: "https://wlaczwizje.pl",
    },
  });

  return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | Accessibility First</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="${page.type === "Article" ? "article" : "website"}">
    <meta property="og:locale" content="pl_PL">
    <meta property="og:site_name" content="Accessibility First">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://www.a11yfirst.pl/assets/social-preview.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="https://www.a11yfirst.pl/assets/social-preview.png">
    <script type="application/ld+json">${jsonLd}</script>
    <link rel="icon" href="${assetPrefix}/a11yfirst-icon.svg?v=5" type="image/svg+xml">
    <link rel="stylesheet" href="${assetPrefix}/styles.css?v=19">
</head>
<body>
    <a href="#main" class="skip-link">Przejdź do głównej treści</a>
    <header>
        <div class="container header-content">
            <a class="site-banner" href="/" aria-label="Accessibility First - strona główna">
                <img class="site-banner-full" src="${assetPrefix}/accessibility-first-logo-transparent.png" alt="" aria-hidden="true">
                <img class="site-banner-icon" src="${assetPrefix}/a11yfirst-icon.svg?v=5" alt="" aria-hidden="true">
            </a>
            <nav aria-label="Menu główne">
                <a href="/o-nas">O nas</a><a href="/szkolenia">Szkolenia</a><a href="/audyty">Audyty</a><a href="/sklep">Sklep</a><a href="/baza-wiedzy">Baza wiedzy</a><a href="/deklaracja">Deklaracja dostępności</a><a href="/kontakt">Kontakt</a>
            </nav>
        </div>
    </header>
    <main id="main">
        ${renderBreadcrumbs(slug, title)}
        <section class="hero page-hero">
            <div class="container">
                <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
                <h1>${escapeHtml(title)}</h1>
                <p class="subtitle">${escapeHtml(description)}</p>
            </div>
        </section>
        <div class="knowledge-article wcag-detail plain-language-page">
            <div class="container">
                ${renderResourceNavigation(slug)}
                ${content}
            </div>
        </div>
    </main>
    <footer>
        <div class="container">
            <div class="footer-contact"><p>Kontakt: <a href="mailto:a11y@wlaczwizje.pl">a11y@wlaczwizje.pl</a></p></div>
            <nav aria-label="Dokumenty prawne" class="footer-nav"><a href="/regulamin">Regulamin świadczenia usług</a><a href="/polityka-prywatnosci">Polityka prywatności i Cookies</a><a href="/deklaracja">Deklaracja dostępności</a></nav>
            <div class="footer-social"><a href="https://wlaczwizje.pl" target="_blank" rel="noopener noreferrer">Włącz Wizję<span class="sr-only"> (otwiera się w nowym oknie)</span></a></div>
            <div class="footer-bottom"><p>&copy; 2026 Włącz Wizję. Wszelkie prawa zastrzeżone.</p></div>
        </div>
    </footer>
    <script src="${assetPrefix}/header.js?v=2"></script>
</body>
</html>
`;
}

for (const page of pages) {
  const markdown = execFileSync("unzip", ["-p", archive, page.source], {
    encoding: "utf8",
  });
  const { metadata, body } = parseFrontmatter(markdown);
  const content = renderMarkdown(body);
  const outputPath = join(outputDirectory, page.output);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderPage(page, metadata, content));
  console.log(`Wygenerowano ${basename(outputPath)}`);
}
