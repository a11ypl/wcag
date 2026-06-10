import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const publicDirectory = resolve(process.argv[2] || "public");
const pages = [
  "prosty-jezyk.html",
  "prosty-jezyk/wcag-3.html",
  "prosty-jezyk/checklista.html",
  "prosty-jezyk/cwiczenia.html",
];
const inboundPages = ["baza-wiedzy.html", "wcag-prostym-jezykiem.html"];
const errors = [];

function report(file, message) {
  errors.push(`${file}: ${message}`);
}

function localTargetExists(href, sourceFile) {
  const path = href.split(/[?#]/)[0];
  if (!path || path === "/") return existsSync(join(publicDirectory, "index.html"));
  const relative = path.replace(/^\//, "");
  const baseDirectory = path.startsWith("/")
    ? publicDirectory
    : dirname(join(publicDirectory, sourceFile));
  const target = resolve(baseDirectory, relative);
  return (
    existsSync(target) ||
    existsSync(`${target}.html`) ||
    existsSync(join(target, "index.html"))
  );
}

for (const file of pages) {
  const html = readFileSync(join(publicDirectory, file), "utf8");
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) report(file, `oczekiwano jednego h1, znaleziono ${h1Count}`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    report(file, `powtórzone id: ${[...new Set(duplicateIds)].join(", ")}`);
  }

  const headings = [...html.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)].map((match) =>
    Number(match[1]),
  );
  headings.forEach((level, index) => {
    if (index && level - headings[index - 1] > 1) {
      report(
        file,
        `przeskok nagłówka h${headings[index - 1]} -> h${level}`,
      );
    }
  });

  if (/<a\b[^>]*>\s*<\/a>/i.test(html)) report(file, "pusty link");

  for (const table of html.matchAll(/<table\b[\s\S]*?<\/table>/g)) {
    if (!/<th\b[^>]*scope="col"/.test(table[0])) {
      report(file, "tabela bez nagłówka kolumny th scope=\"col\"");
    }
  }

  const sourceHeading = html.lastIndexOf(">Źródła</h2>");
  const finalArticle = html.lastIndexOf("</article>");
  if (sourceHeading === -1 || sourceHeading > finalArticle || finalArticle - sourceHeading > 5000) {
    report(file, "sekcja Źródła nie jest ostatnim artykułem merytorycznym");
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    if (!localTargetExists(href, file)) report(file, `brak celu linku ${href}`);
  }
}

for (const file of inboundPages) {
  const html = readFileSync(join(publicDirectory, file), "utf8");
  if (!html.includes('href="/prosty-jezyk"')) {
    report(file, "brak linku do /prosty-jezyk");
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Walidacja zakończona: ${pages.length} strony zasobu, ${inboundPages.length} strony wejściowe.`,
);
