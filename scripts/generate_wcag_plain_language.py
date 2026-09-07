#!/usr/bin/env python3
from __future__ import annotations

import argparse
from html import escape
from pathlib import Path
import re

from wcag_criteria_data import (
    CRITERIA,
    CRITERIA_BY_NUMBER,
    REMOVED_IN_WCAG_22,
    SECTION_BY_PRINCIPLE,
    Criterion,
    format_versions_inline,
    format_versions_sentence,
    number_from_slug,
    section_for_criterion,
)


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "public" / "wcag-prostym-jezykiem.html"
PAGES_DIR = ROOT / "public" / "wcag-prostym-jezykiem"
INDEX_START = "                <!-- WCAG-CRITERIA:START -->"
INDEX_END = "                <!-- WCAG-CRITERIA:END -->"


def render_index_sections() -> str:
    sections = []

    for principle, (section_id, section_title) in SECTION_BY_PRINCIPLE.items():
        items = []
        for criterion in CRITERIA:
            if not criterion.number.startswith(f"{principle}."):
                continue

            suffix = format_versions_inline(criterion.number)
            if criterion.number in REMOVED_IN_WCAG_22:
                suffix += "; przydatne przy pracy ze starszymi audytami"
            items.append(
                "                        "
                f'<li><a href="{criterion.href}">{escape(criterion.full_title)}</a> '
                f'- poziom {criterion.level}; {suffix}</li>'
            )

        sections.extend(
            [
                f'                <section class="knowledge-panel" aria-labelledby="{section_id}-title">',
                f"                    <h2 id=\"{section_id}-title\">{section_title}</h2>",
                '                    <ul class="detail-list">',
                *items,
                "                    </ul>",
                "                </section>",
            ]
        )

    return "\n".join([INDEX_START, *sections, INDEX_END])


def replace_index_sections(html: str) -> str:
    rendered = render_index_sections()
    marker_pattern = re.compile(
        rf"{re.escape(INDEX_START)}.*?{re.escape(INDEX_END)}", re.DOTALL
    )
    if marker_pattern.search(html):
        return marker_pattern.sub(rendered, html, count=1)

    legacy_pattern = re.compile(
        r'                <section class="knowledge-panel" aria-labelledby="perceivable-title">.*?'
        r'(?=                <article class="knowledge-panel" '
        r'aria-labelledby="plain-language-resource-title">)',
        re.DOTALL,
    )
    updated, replacements = legacy_pattern.subn(rendered + "\n", html, count=1)
    if replacements != 1:
        raise ValueError("Nie znaleziono sekcji kryteriów w indeksie WCAG.")
    return updated


def render_navigation(position: int) -> str:
    links = []
    if position > 0:
        previous = CRITERIA[position - 1]
        links.append(
            f'<a href="{previous.href}">Poprzednie: {escape(previous.full_title)}</a>'
        )

    links.append('<a href="/wcag-prostym-jezykiem">Wróć do listy kryteriów</a>')

    if position + 1 < len(CRITERIA):
        following = CRITERIA[position + 1]
        links.append(
            f'<a href="{following.href}">Następne: {escape(following.full_title)}</a>'
        )

    return (
        '<nav class="criterion-navigation" aria-label="Nawigacja między kryteriami WCAG">'
        + "".join(links)
        + "</nav>"
    )


def replace_detail_metadata(html: str, criterion: Criterion, position: int) -> str:
    section_title = section_for_criterion(criterion.number)[1]
    hero_pattern = re.compile(
        r'(<section class="hero page-hero">\s*<div class="container">\s*)'
        r'<p class="eyebrow">.*?</p>\s*<h1>.*?</h1>\s*'
        r'(<p class="subtitle">.*?</p>)\s*'
        r'(?:<p class="criterion-versions">.*?</p>)?',
        re.DOTALL,
    )
    replacement = (
        r'\1'
        f'<p class="eyebrow">{section_title} · Poziom {criterion.level}</p>'
        f'<h1>{escape(criterion.full_title)}</h1>'
        r'\2'
        f'<p class="criterion-versions">{format_versions_sentence(criterion.number)}</p>'
    )
    html, replacements = hero_pattern.subn(replacement, html, count=1)
    if replacements != 1:
        raise ValueError(f"Nie znaleziono nagłówka strony dla {criterion.slug}.")

    full_title = escape(criterion.full_title)
    page_title = f"{full_title} - WCAG prostym językiem | Accessibility First"
    html, replacements = re.subn(
        r"<title>.*?</title>", f"<title>{page_title}</title>", html, count=1
    )
    if replacements != 1:
        raise ValueError(f"Nie znaleziono tytułu dokumentu dla {criterion.slug}.")

    for property_name in ("og:title", "twitter:title"):
        html, replacements = re.subn(
            rf'(<meta (?:property|name)="{property_name}" content=")[^"]*(">)',
            rf'\g<1>{page_title}\g<2>',
            html,
            count=1,
        )
        if replacements != 1:
            raise ValueError(f"Nie znaleziono metadanych {property_name} dla {criterion.slug}.")

    breadcrumb_pattern = re.compile(
        r'(<nav class="breadcrumbs".*?<li aria-current="page">).*?(</li>)',
        re.DOTALL,
    )
    html, replacements = breadcrumb_pattern.subn(
        rf'\g<1>{full_title}\g<2>', html, count=1
    )
    if replacements != 1:
        raise ValueError(f"Nie znaleziono okruszków dla {criterion.slug}.")

    navigation_pattern = re.compile(
        r'<nav class="criterion-navigation"[^>]*>.*?</nav>', re.DOTALL
    )
    matches = list(navigation_pattern.finditer(html))
    if not matches:
        raise ValueError(f"Nie znaleziono nawigacji kryterium dla {criterion.slug}.")
    match = matches[-1]
    return html[: match.start()] + render_navigation(position) + html[match.end() :]


def rendered_files() -> dict[Path, str]:
    rendered = {INDEX_PATH: replace_index_sections(INDEX_PATH.read_text(encoding="utf-8"))}
    positions = {criterion.number: position for position, criterion in enumerate(CRITERIA)}

    for path in sorted(PAGES_DIR.glob("*.html")):
        number = number_from_slug(path.stem)
        if number not in CRITERIA_BY_NUMBER:
            continue
        rendered[path] = replace_detail_metadata(
            path.read_text(encoding="utf-8"), CRITERIA_BY_NUMBER[number], positions[number]
        )

    expected_paths = {PAGES_DIR / f"{criterion.slug}.html" for criterion in CRITERIA}
    missing_pages = sorted(path.name for path in expected_paths if path not in rendered)
    if missing_pages:
        raise ValueError(f"Brakuje podstron kryteriów: {', '.join(missing_pages)}")
    return rendered


def get_drift() -> list[Path]:
    return [path for path, content in rendered_files().items() if path.read_text(encoding="utf-8") != content]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generuje listę WCAG oraz wspólne metadane i nawigację kryteriów."
    )
    parser.add_argument(
        "--check", action="store_true", help="Sprawdza, czy pliki są aktualne."
    )
    args = parser.parse_args()

    rendered = rendered_files()
    drift = [path for path, content in rendered.items() if path.read_text(encoding="utf-8") != content]
    if args.check:
        if drift:
            for path in drift:
                print(path.relative_to(ROOT))
            print("Pliki WCAG wymagają ponownego wygenerowania.")
            return 1
        print(f"OK: pliki WCAG są zgodne z danymi ({len(CRITERIA)} kryteriów).")
        return 0

    for path in drift:
        path.write_text(rendered[path], encoding="utf-8")
        print(f"Wygenerowano {path.relative_to(ROOT)}")
    print(f"Zaktualizowano {len(drift)} plików WCAG.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
