from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Criterion:
    number: str
    slug: str
    title: str
    level: str

    @property
    def href(self) -> str:
        return f"/wcag-prostym-jezykiem/{self.slug}"

    @property
    def full_title(self) -> str:
        return f"{self.number} {self.title}"


SECTION_BY_PRINCIPLE = {
    "1": ("perceivable", "Postrzegalność"),
    "2": ("operable", "Funkcjonalność"),
    "3": ("understandable", "Zrozumiałość"),
    "4": ("robust", "Solidność"),
}


# Jedno źródło prawdy dla wspólnych danych na liście i podstronach kryteriów.
CRITERIA = (
    Criterion("1.1.1", "1-1-1-tresc-nietekstowa", "Treść nietekstowa", "A"),
    Criterion("1.2.1", "1-2-1-tylko-audio-oraz-tylko-wideo", "Tylko audio oraz tylko wideo", "A"),
    Criterion("1.2.2", "1-2-2-napisy-rozszerzone", "Napisy rozszerzone", "A"),
    Criterion("1.2.3", "1-2-3-audiodeskrypcja-lub-alternatywa-dla-mediow", "Audiodeskrypcja lub alternatywa dla mediów", "A"),
    Criterion("1.2.4", "1-2-4-napisy-rozszerzone-na-zywo", "Napisy rozszerzone na żywo", "AA"),
    Criterion("1.2.5", "1-2-5-audiodeskrypcja", "Audiodeskrypcja", "AA"),
    Criterion("1.2.6", "1-2-6-jezyk-migowy-nagranie", "Język migowy (nagranie)", "AAA"),
    Criterion("1.2.7", "1-2-7-rozszerzona-audiodeskrypcja-nagranie", "Rozszerzona audiodeskrypcja (nagranie)", "AAA"),
    Criterion("1.2.8", "1-2-8-alternatywa-dla-mediow-nagranie", "Alternatywa dla mediów (nagranie)", "AAA"),
    Criterion("1.2.9", "1-2-9-tylko-audio-na-zywo", "Tylko audio (na żywo)", "AAA"),
    Criterion("1.3.1", "1-3-1-informacje-i-relacje", "Informacje i relacje", "A"),
    Criterion("1.3.2", "1-3-2-zrozumiala-kolejnosc", "Zrozumiała kolejność", "A"),
    Criterion("1.3.3", "1-3-3-wlasciwosci-zmyslowe", "Właściwości zmysłowe", "A"),
    Criterion("1.3.4", "1-3-4-orientacja", "Orientacja", "AA"),
    Criterion("1.3.5", "1-3-5-okreslenie-celu-danych-wejsciowych", "Określenie celu danych wejściowych", "AA"),
    Criterion("1.3.6", "1-3-6-okreslenie-celu", "Określenie celu", "AAA"),
    Criterion("1.4.1", "1-4-1-uzycie-koloru", "Użycie koloru", "A"),
    Criterion("1.4.2", "1-4-2-kontrola-odtwarzania-dzwieku", "Kontrola odtwarzania dźwięku", "A"),
    Criterion("1.4.3", "1-4-3-kontrast-minimum", "Kontrast minimum", "AA"),
    Criterion("1.4.4", "1-4-4-zmiana-rozmiaru-tekstu", "Zmiana rozmiaru tekstu", "AA"),
    Criterion("1.4.5", "1-4-5-obrazy-tekstu", "Obrazy tekstu", "AA"),
    Criterion("1.4.6", "1-4-6-kontrast-podwyzszony", "Kontrast (podwyższony)", "AAA"),
    Criterion("1.4.7", "1-4-7-cichy-lub-brak-tla-dzwiekowego", "Cichy lub brak tła dźwiękowego", "AAA"),
    Criterion("1.4.8", "1-4-8-prezentacja-wizualna", "Prezentacja wizualna", "AAA"),
    Criterion("1.4.9", "1-4-9-obrazy-tekstu-bez-wyjatku", "Obrazy tekstu (bez wyjątku)", "AAA"),
    Criterion("1.4.10", "1-4-10-dopasowanie-do-ekranu", "Dopasowanie do ekranu", "AA"),
    Criterion("1.4.11", "1-4-11-kontrast-elementow-nietekstowych", "Kontrast elementów nietekstowych", "AA"),
    Criterion("1.4.12", "1-4-12-odstepy-w-tekscie", "Odstępy w tekście", "AA"),
    Criterion("1.4.13", "1-4-13-tresc-po-najechaniu-lub-fokusie", "Treść po najechaniu lub fokusie", "AA"),
    Criterion("2.1.1", "2-1-1-klawiatura", "Klawiatura", "A"),
    Criterion("2.1.2", "2-1-2-brak-pulapki-na-klawiature", "Brak pułapki na klawiaturę", "A"),
    Criterion("2.1.3", "2-1-3-klawiatura-bez-wyjatku", "Klawiatura (bez wyjątku)", "AAA"),
    Criterion("2.1.4", "2-1-4-skroty-klawiszowe-znakowe", "Skróty klawiszowe znakowe", "A"),
    Criterion("2.2.1", "2-2-1-mozliwosc-dostosowania-czasu", "Możliwość dostosowania czasu", "A"),
    Criterion("2.2.2", "2-2-2-pauza-zatrzymanie-ukrycie", "Pauza, zatrzymanie, ukrycie", "A"),
    Criterion("2.2.3", "2-2-3-brak-limitow-czasu", "Brak limitów czasu", "AAA"),
    Criterion("2.2.4", "2-2-4-przerwania", "Przerwania", "AAA"),
    Criterion("2.2.5", "2-2-5-ponowne-uwierzytelnianie", "Ponowne uwierzytelnianie", "AAA"),
    Criterion("2.2.6", "2-2-6-limity-czasu", "Limity czasu", "AAA"),
    Criterion("2.3.1", "2-3-1-trzy-blyski-lub-wartosci-ponizej-progu", "Trzy błyski lub wartości poniżej progu", "A"),
    Criterion("2.3.2", "2-3-2-trzy-blyski", "Trzy błyski", "AAA"),
    Criterion("2.3.3", "2-3-3-animacja-po-interakcji", "Animacja po interakcji", "AAA"),
    Criterion("2.4.1", "2-4-1-mozliwosc-pominiecia-blokow", "Możliwość pominięcia bloków", "A"),
    Criterion("2.4.2", "2-4-2-tytul-strony", "Tytuł strony", "A"),
    Criterion("2.4.3", "2-4-3-kolejnosc-fokusu", "Kolejność fokusu", "A"),
    Criterion("2.4.4", "2-4-4-cel-linku-w-kontekscie", "Cel linku w kontekście", "A"),
    Criterion("2.4.5", "2-4-5-wiele-sposobow", "Wiele sposobów", "AA"),
    Criterion("2.4.6", "2-4-6-naglowki-i-etykiety", "Nagłówki i etykiety", "AA"),
    Criterion("2.4.7", "2-4-7-widoczny-fokus", "Widoczny fokus", "AA"),
    Criterion("2.4.8", "2-4-8-lokalizacja", "Lokalizacja", "AAA"),
    Criterion("2.4.9", "2-4-9-cel-linku-sam-link", "Cel linku (sam link)", "AAA"),
    Criterion("2.4.10", "2-4-10-naglowki-sekcji", "Nagłówki sekcji", "AAA"),
    Criterion("2.4.11", "2-4-11-fokus-niezakryty-minimum", "Fokus niezakryty (minimum)", "AA"),
    Criterion("2.4.12", "2-4-12-fokus-niezakryty-rozszerzony", "Fokus niezakryty (rozszerzony)", "AAA"),
    Criterion("2.4.13", "2-4-13-wyglad-fokusu", "Wygląd fokusu", "AAA"),
    Criterion("2.5.1", "2-5-1-gesty-wskaznika", "Gesty wskaźnika", "A"),
    Criterion("2.5.2", "2-5-2-anulowanie-wskazania", "Anulowanie wskazania", "A"),
    Criterion("2.5.3", "2-5-3-etykieta-w-nazwie", "Etykieta w nazwie", "A"),
    Criterion("2.5.4", "2-5-4-aktywowanie-ruchem", "Aktywowanie ruchem", "A"),
    Criterion("2.5.5", "2-5-5-rozmiar-celu-rozszerzony", "Rozmiar celu (rozszerzony)", "AAA"),
    Criterion("2.5.6", "2-5-6-rownoczesne-mechanizmy-wejscia", "Równoczesne mechanizmy wejścia", "AAA"),
    Criterion("2.5.7", "2-5-7-ruch-przeciagania", "Ruch przeciągania", "AA"),
    Criterion("2.5.8", "2-5-8-rozmiar-celu-minimum", "Rozmiar celu (minimum)", "AA"),
    Criterion("3.1.1", "3-1-1-jezyk-strony", "Język strony", "A"),
    Criterion("3.1.2", "3-1-2-jezyk-czesci", "Język części", "AA"),
    Criterion("3.1.3", "3-1-3-nietypowe-slowa", "Nietypowe słowa", "AAA"),
    Criterion("3.1.4", "3-1-4-skroty", "Skróty", "AAA"),
    Criterion("3.1.5", "3-1-5-poziom-czytania", "Poziom czytania", "AAA"),
    Criterion("3.1.6", "3-1-6-wymowa", "Wymowa", "AAA"),
    Criterion("3.2.1", "3-2-1-po-otrzymaniu-fokusu", "Po otrzymaniu fokusu", "A"),
    Criterion("3.2.2", "3-2-2-podczas-wprowadzania-danych", "Podczas wprowadzania danych", "A"),
    Criterion("3.2.3", "3-2-3-spojna-nawigacja", "Spójna nawigacja", "AA"),
    Criterion("3.2.4", "3-2-4-spojna-identyfikacja", "Spójna identyfikacja", "AA"),
    Criterion("3.2.5", "3-2-5-zmiana-na-zadanie", "Zmiana na żądanie", "AAA"),
    Criterion("3.2.6", "3-2-6-spojna-pomoc", "Spójna pomoc", "A"),
    Criterion("3.3.1", "3-3-1-identyfikacja-bledu", "Identyfikacja błędu", "A"),
    Criterion("3.3.2", "3-3-2-etykiety-lub-instrukcje", "Etykiety lub instrukcje", "A"),
    Criterion("3.3.3", "3-3-3-sugestie-korekty-bledow", "Sugestie korekty błędów", "AA"),
    Criterion("3.3.4", "3-3-4-zapobieganie-bledom-prawne-finansowe-dane", "Zapobieganie błędom (prawne, finansowe, dane)", "AA"),
    Criterion("3.3.5", "3-3-5-pomoc", "Pomoc", "AAA"),
    Criterion("3.3.6", "3-3-6-zapobieganie-bledom-wszystkie", "Zapobieganie błędom (wszystkie)", "AAA"),
    Criterion("3.3.7", "3-3-7-powtarzajace-sie-wpisy", "Powtarzające się wpisy", "A"),
    Criterion("3.3.8", "3-3-8-dostepne-uwierzytelnianie-minimum", "Dostępne uwierzytelnianie (minimum)", "AA"),
    Criterion("3.3.9", "3-3-9-dostepne-uwierzytelnianie-rozszerzone", "Dostępne uwierzytelnianie (rozszerzone)", "AAA"),
    Criterion("4.1.1", "4-1-1-parsowanie", "Parsowanie", "A"),
    Criterion("4.1.2", "4-1-2-nazwa-rola-wartosc", "Nazwa, rola, wartość", "A"),
    Criterion("4.1.3", "4-1-3-komunikaty-o-stanie", "Komunikaty o stanie", "AA"),
)


def _criteria_range(principle: int, guideline: int, start: int, end: int) -> set[str]:
    return {f"{principle}.{guideline}.{criterion}" for criterion in range(start, end + 1)}


WCAG_20_CRITERIA = (
    {"1.1.1"}
    | _criteria_range(1, 2, 1, 9)
    | _criteria_range(1, 3, 1, 3)
    | _criteria_range(1, 4, 1, 9)
    | _criteria_range(2, 1, 1, 3)
    | _criteria_range(2, 2, 1, 5)
    | _criteria_range(2, 3, 1, 2)
    | _criteria_range(2, 4, 1, 10)
    | _criteria_range(3, 1, 1, 6)
    | _criteria_range(3, 2, 1, 5)
    | _criteria_range(3, 3, 1, 6)
    | _criteria_range(4, 1, 1, 2)
)

WCAG_21_ADDED_CRITERIA = {
    "1.3.4", "1.3.5", "1.3.6", "1.4.10", "1.4.11", "1.4.12", "1.4.13",
    "2.1.4", "2.2.6", "2.3.3", "2.5.1", "2.5.2", "2.5.3", "2.5.4",
    "2.5.5", "2.5.6", "4.1.3",
}

WCAG_22_ADDED_CRITERIA = {
    "2.4.11", "2.4.12", "2.4.13", "2.5.7", "2.5.8", "3.2.6", "3.3.7",
    "3.3.8", "3.3.9",
}

REMOVED_IN_WCAG_22 = {"4.1.1"}
ALL_KNOWN_CRITERIA = WCAG_20_CRITERIA | WCAG_21_ADDED_CRITERIA | WCAG_22_ADDED_CRITERIA
CRITERIA_BY_NUMBER = {criterion.number: criterion for criterion in CRITERIA}

if set(CRITERIA_BY_NUMBER) != ALL_KNOWN_CRITERIA or len(CRITERIA_BY_NUMBER) != len(CRITERIA):
    raise ValueError("WCAG criteria data is incomplete or contains duplicate numbers.")


def criterion_sort_key(number: str) -> tuple[int, int, int]:
    return tuple(int(part) for part in number.split("."))


def number_from_slug(slug: str) -> str | None:
    parts = slug.split("-")
    if len(parts) < 3 or not all(part.isdigit() for part in parts[:3]):
        return None
    return ".".join(parts[:3])


def criterion_for_number(number: str) -> Criterion:
    return CRITERIA_BY_NUMBER[number]


def section_for_criterion(number: str) -> tuple[str, str]:
    return SECTION_BY_PRINCIPLE[number.split(".")[0]]


def versions_for_criterion(number: str) -> tuple[str, ...]:
    if number in WCAG_20_CRITERIA:
        versions = ["WCAG 2.0", "WCAG 2.1"]
        if number not in REMOVED_IN_WCAG_22:
            versions.append("WCAG 2.2")
        return tuple(versions)
    if number in WCAG_21_ADDED_CRITERIA:
        return ("WCAG 2.1", "WCAG 2.2")
    if number in WCAG_22_ADDED_CRITERIA:
        return ("WCAG 2.2",)
    raise ValueError(f"Unknown WCAG criterion number: {number}")


def format_versions_inline(number: str) -> str:
    versions = versions_for_criterion(number)
    if number in REMOVED_IN_WCAG_22:
        return "występuje w WCAG 2.0 i WCAG 2.1; usunięte z WCAG 2.2"
    if len(versions) == 1:
        return f"występuje w {versions[0]}"
    return f"występuje w {', '.join(versions[:-1])} i {versions[-1]}"


def format_versions_sentence(number: str) -> str:
    versions = versions_for_criterion(number)
    if number in REMOVED_IN_WCAG_22:
        return "Występuje w WCAG 2.0 i WCAG 2.1; w WCAG 2.2 zostało usunięte."
    if len(versions) == 1:
        return f"Występuje w: {versions[0]}."
    return f"Występuje w: {', '.join(versions[:-1])} i {versions[-1]}."
