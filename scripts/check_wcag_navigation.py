#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys

from generate_wcag_plain_language import get_drift
from wcag_criteria_data import (
    CRITERIA,
    CRITERIA_BY_NUMBER,
    SECTION_BY_PRINCIPLE,
    criterion_sort_key,
    format_versions_inline,
    format_versions_sentence,
    number_from_slug,
    section_for_criterion,
)


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "public" / "wcag-prostym-jezykiem.html"
PAGES_DIR = ROOT / "public" / "wcag-prostym-jezykiem"
VERCEL_PATH = ROOT / "vercel.json"


def normalized(parts: list[str]) -> str:
    return " ".join("".join(parts).split())


class IndexParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.in_item = False
        self.in_link = False
        self.href = ""
        self.item_text: list[str] = []
        self.link_text: list[str] = []
        self.items: list[dict[str, str]] = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "main":
            self.in_main = True
        elif self.in_main and tag == "li":
            self.in_item = True
            self.item_text = []
            self.href = ""
        elif self.in_item and tag == "a":
            href = attributes.get("href", "")
            if href.startswith("/wcag-prostym-jezykiem/"):
                self.in_link = True
                self.href = href
                self.link_text = []

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False
        elif tag == "a":
            self.in_link = False
        elif tag == "li" and self.in_item:
            if self.href:
                self.items.append(
                    {
                        "href": self.href,
                        "link_text": normalized(self.link_text),
                        "item_text": normalized(self.item_text),
                    }
                )
            self.in_item = False

    def handle_data(self, data):
        if self.in_item:
            self.item_text.append(data)
        if self.in_link:
            self.link_text.append(data)


class DetailParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h1 = False
        self.in_eyebrow = False
        self.in_versions = False
        self.in_navigation = False
        self.in_navigation_link = False
        self.h1: list[str] = []
        self.eyebrow: list[str] = []
        self.versions: list[str] = []
        self.navigation: list[tuple[str, str]] = []
        self.current_href = ""
        self.current_link_text: list[str] = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        classes = attributes.get("class", "").split()
        if tag == "h1":
            self.in_h1 = True
        elif tag == "p" and "eyebrow" in classes:
            self.in_eyebrow = True
        elif tag == "p" and "criterion-versions" in classes:
            self.in_versions = True
        elif tag == "nav" and "criterion-navigation" in classes:
            self.in_navigation = True
        elif tag == "a" and self.in_navigation:
            self.in_navigation_link = True
            self.current_href = attributes.get("href", "")
            self.current_link_text = []

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False
        elif tag == "p":
            self.in_eyebrow = False
            self.in_versions = False
        elif tag == "a" and self.in_navigation_link:
            self.navigation.append((self.current_href, normalized(self.current_link_text)))
            self.in_navigation_link = False
        elif tag == "nav":
            self.in_navigation = False

    def handle_data(self, data):
        if self.in_h1:
            self.h1.append(data)
        if self.in_eyebrow:
            self.eyebrow.append(data)
        if self.in_versions:
            self.versions.append(data)
        if self.in_navigation_link:
            self.current_link_text.append(data)


def parse_index() -> list[dict[str, str]]:
    parser = IndexParser()
    parser.feed(INDEX_PATH.read_text(encoding="utf-8"))
    return parser.items


def expected_navigation(position: int) -> list[tuple[str, str]]:
    links = []
    if position > 0:
        previous = CRITERIA[position - 1]
        links.append((previous.href, f"Poprzednie: {previous.full_title}"))
    links.append(("/wcag-prostym-jezykiem", "Wróć do listy kryteriów"))
    if position + 1 < len(CRITERIA):
        following = CRITERIA[position + 1]
        links.append((following.href, f"Następne: {following.full_title}"))
    return links


def check_data() -> list[str]:
    numbers = [criterion.number for criterion in CRITERIA]
    if numbers != sorted(numbers, key=criterion_sort_key):
        return ["Katalog kryteriów nie jest posortowany numerycznie."]
    if len(numbers) != len(set(numbers)):
        return ["Katalog kryteriów zawiera zduplikowane numery."]
    return []


def check_index() -> list[str]:
    problems = []
    items = parse_index()
    if len(items) != len(CRITERIA):
        problems.append(f"Indeks zawiera {len(items)} pozycji, oczekiwano {len(CRITERIA)}.")

    for item, criterion in zip(items, CRITERIA):
        suffix = format_versions_inline(criterion.number)
        if criterion.number == "4.1.1":
            suffix += "; przydatne przy pracy ze starszymi audytami"
        expected_item = f"{criterion.full_title} - poziom {criterion.level}; {suffix}"
        if item["href"] != criterion.href or item["link_text"] != criterion.full_title:
            problems.append(f"Indeks nie wskazuje kanonicznego kryterium {criterion.number}.")
        if item["item_text"] != expected_item:
            problems.append(f"Indeks ma nieaktualne dane dla {criterion.number}.")
    return problems


def check_pages() -> list[str]:
    problems = []
    positions = {criterion.number: position for position, criterion in enumerate(CRITERIA)}
    canonical_paths = {PAGES_DIR / f"{criterion.slug}.html" for criterion in CRITERIA}
    for path in sorted(PAGES_DIR.glob("*.html")):
        number = number_from_slug(path.stem)
        if number not in CRITERIA_BY_NUMBER:
            problems.append(f"Nieznany numer kryterium w nazwie pliku: {path.name}")
            continue
        criterion = CRITERIA_BY_NUMBER[number]
        parser = DetailParser()
        html = path.read_text(encoding="utf-8")
        parser.feed(html)
        section_title = section_for_criterion(number)[1]
        if normalized(parser.h1) != criterion.full_title:
            problems.append(f"Nieprawidłowy h1 w {path.name}.")
        if normalized(parser.eyebrow) != f"{section_title} · Poziom {criterion.level}":
            problems.append(f"Nieprawidłowa sekcja lub poziom w {path.name}.")
        if normalized(parser.versions) != format_versions_sentence(number):
            problems.append(f"Nieprawidłowa informacja o wersjach w {path.name}.")
        if parser.navigation != expected_navigation(positions[number]):
            problems.append(f"Nieprawidłowa nawigacja w {path.name}.")
        if path in canonical_paths:
            expected_canonical = f'<link rel="canonical" href="https://www.a11yfirst.pl{criterion.href}">'
            if expected_canonical not in html:
                problems.append(f"Nieprawidłowy canonical URL w {path.name}.")

    missing = sorted(path.name for path in canonical_paths if not path.exists())
    if missing:
        problems.append(f"Brakuje podstron kanonicznych: {', '.join(missing)}")
    return problems


def check_duplicate_redirects() -> list[str]:
    redirects = {
        redirect["source"]: redirect["destination"]
        for redirect in json.loads(VERCEL_PATH.read_text(encoding="utf-8")).get("redirects", [])
    }
    canonical_slugs = {criterion.slug for criterion in CRITERIA}
    problems = []
    for path in sorted(PAGES_DIR.glob("*.html")):
        if path.stem in canonical_slugs:
            continue
        number = number_from_slug(path.stem)
        if number not in CRITERIA_BY_NUMBER:
            continue
        source = f"/wcag-prostym-jezykiem/{path.stem}"
        if redirects.get(source) != CRITERIA_BY_NUMBER[number].href:
            problems.append(f"Brakuje przekierowania: {source}")
    return problems


def main() -> int:
    problems = []
    problems.extend(check_data())
    problems.extend(check_index())
    problems.extend(check_pages())
    problems.extend(check_duplicate_redirects())
    drift = get_drift()
    if drift:
        problems.append("Pliki wygenerowane są niezgodne z katalogiem kryteriów.")

    if problems:
        print("\n".join(problems))
        return 1
    print(
        f"OK: {len(CRITERIA)} kryteriów, indeks, podstrony, nawigacja, wersje WCAG "
        "i przekierowania są zgodne z jednym źródłem danych."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
