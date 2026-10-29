// Kryteria sukcesu WCAG 2.1 i 2.2 z polskimi nazwami.
// 4.1.1 występuje w WCAG 2.0 i 2.1 — w WCAG 2.2 zostało usunięte.

const P = "Postrzegalność";
const F = "Funkcjonalność";
const Z = "Zrozumiałość";
const K = "Kompatybilność";
const ALL = ["WCAG 2.0", "WCAG 2.1", "WCAG 2.2"];
const FROM_21 = ["WCAG 2.1", "WCAG 2.2"];
const ONLY_22 = ["WCAG 2.2"];
const UNTIL_21 = ["WCAG 2.0", "WCAG 2.1"];

const c = (id, title, level, principle, versions = ALL) => ({ id, title, level, principle, versions });

export const WCAG_CRITERIA = [
  c("1.1.1", "Treść nietekstowa", "A", P),
  c("1.2.1", "Tylko audio oraz tylko wideo (nagranie)", "A", P),
  c("1.2.2", "Napisy rozszerzone (nagranie)", "A", P),
  c("1.2.3", "Audiodeskrypcja lub alternatywa dla mediów (nagranie)", "A", P),
  c("1.2.4", "Napisy rozszerzone (na żywo)", "AA", P),
  c("1.2.5", "Audiodeskrypcja (nagranie)", "AA", P),
  c("1.2.6", "Język migowy (nagranie)", "AAA", P),
  c("1.2.7", "Rozszerzona audiodeskrypcja (nagranie)", "AAA", P),
  c("1.2.8", "Alternatywa dla mediów (nagranie)", "AAA", P),
  c("1.2.9", "Tylko audio (na żywo)", "AAA", P),
  c("1.3.1", "Informacje i relacje", "A", P),
  c("1.3.2", "Zrozumiała kolejność", "A", P),
  c("1.3.3", "Właściwości zmysłowe", "A", P),
  c("1.3.4", "Orientacja", "AA", P, FROM_21),
  c("1.3.5", "Określenie przeznaczenia pól wprowadzania danych", "AA", P, FROM_21),
  c("1.3.6", "Określenie przeznaczenia", "AAA", P, FROM_21),
  c("1.4.1", "Użycie koloru", "A", P),
  c("1.4.2", "Kontrola odtwarzania dźwięku", "A", P),
  c("1.4.3", "Kontrast (minimum)", "AA", P),
  c("1.4.4", "Zmiana rozmiaru tekstu", "AA", P),
  c("1.4.5", "Obrazy tekstu", "AA", P),
  c("1.4.6", "Kontrast (wzmocniony)", "AAA", P),
  c("1.4.7", "Niska głośność lub brak tła dźwiękowego", "AAA", P),
  c("1.4.8", "Prezentacja wizualna", "AAA", P),
  c("1.4.9", "Obrazy tekstu (bez wyjątków)", "AAA", P),
  c("1.4.10", "Dopasowanie do ekranu", "AA", P, FROM_21),
  c("1.4.11", "Kontrast elementów nietekstowych", "AA", P, FROM_21),
  c("1.4.12", "Odstępy w tekście", "AA", P, FROM_21),
  c("1.4.13", "Treść spod kursora lub fokusu", "AA", P, FROM_21),
  c("2.1.1", "Klawiatura", "A", F),
  c("2.1.2", "Brak pułapki na klawiaturę", "A", F),
  c("2.1.3", "Klawiatura (bez wyjątków)", "AAA", F),
  c("2.1.4", "Jednoznakowe skróty klawiaturowe", "A", F, FROM_21),
  c("2.2.1", "Dostosowanie czasu", "A", F),
  c("2.2.2", "Wstrzymywanie (pauza), zatrzymywanie, ukrywanie", "A", F),
  c("2.2.3", "Brak ograniczeń czasowych", "AAA", F),
  c("2.2.4", "Przerywanie", "AAA", F),
  c("2.2.5", "Ponowne uwierzytelnienie", "AAA", F),
  c("2.2.6", "Limity czasu", "AAA", F, FROM_21),
  c("2.3.1", "Trzy błyski lub wartości poniżej progu", "A", F),
  c("2.3.2", "Trzy błyski", "AAA", F),
  c("2.3.3", "Animacja po interakcji", "AAA", F, FROM_21),
  c("2.4.1", "Możliwość pominięcia bloków", "A", F),
  c("2.4.2", "Tytuły stron", "A", F),
  c("2.4.3", "Kolejność fokusu", "A", F),
  c("2.4.4", "Cel linku (w kontekście)", "A", F),
  c("2.4.5", "Wiele dróg", "AA", F),
  c("2.4.6", "Nagłówki i etykiety", "AA", F),
  c("2.4.7", "Widoczny fokus", "AA", F),
  c("2.4.8", "Lokalizacja", "AAA", F),
  c("2.4.9", "Cel linku (z samego linku)", "AAA", F),
  c("2.4.10", "Nagłówki sekcji", "AAA", F),
  c("2.4.11", "Fokus niezasłonięty (minimum)", "AA", F, ONLY_22),
  c("2.4.12", "Fokus niezasłonięty (rozszerzony)", "AAA", F, ONLY_22),
  c("2.4.13", "Wygląd fokusu", "AAA", F, ONLY_22),
  c("2.5.1", "Gesty wskazujące", "A", F, FROM_21),
  c("2.5.2", "Rezygnacja ze wskazania", "A", F, FROM_21),
  c("2.5.3", "Etykieta w nazwie", "A", F, FROM_21),
  c("2.5.4", "Aktywowanie ruchem", "A", F, FROM_21),
  c("2.5.5", "Rozmiar celu (rozszerzony)", "AAA", F, FROM_21),
  c("2.5.6", "Równoczesne mechanizmy wprowadzania", "AAA", F, FROM_21),
  c("2.5.7", "Ruchy przeciągania", "AA", F, ONLY_22),
  c("2.5.8", "Rozmiar celu (minimum)", "AA", F, ONLY_22),
  c("3.1.1", "Język strony", "A", Z),
  c("3.1.2", "Język części", "AA", Z),
  c("3.1.3", "Nietypowe słowa", "AAA", Z),
  c("3.1.4", "Skróty", "AAA", Z),
  c("3.1.5", "Poziom umiejętności czytania", "AAA", Z),
  c("3.1.6", "Wymowa", "AAA", Z),
  c("3.2.1", "Po otrzymaniu fokusu", "A", Z),
  c("3.2.2", "Podczas wprowadzania danych", "A", Z),
  c("3.2.3", "Spójna nawigacja", "AA", Z),
  c("3.2.4", "Spójna identyfikacja", "AA", Z),
  c("3.2.5", "Zmiana na żądanie", "AAA", Z),
  c("3.2.6", "Spójna pomoc", "A", Z, ONLY_22),
  c("3.3.1", "Identyfikacja błędu", "A", Z),
  c("3.3.2", "Etykiety lub instrukcje", "A", Z),
  c("3.3.3", "Sugestie korekty błędów", "AA", Z),
  c("3.3.4", "Zapobieganie błędom (kontekst prawny, finansowy, dane)", "AA", Z),
  c("3.3.5", "Pomoc", "AAA", Z),
  c("3.3.6", "Zapobieganie błędom (wszystkie dane)", "AAA", Z),
  c("3.3.7", "Nadmiarowe wprowadzanie danych", "A", Z, ONLY_22),
  c("3.3.8", "Dostępne uwierzytelnianie (minimum)", "AA", Z, ONLY_22),
  c("3.3.9", "Dostępne uwierzytelnianie (rozszerzone)", "AAA", Z, ONLY_22),
  c("4.1.1", "Poprawność kodu", "A", K, UNTIL_21),
  c("4.1.2", "Nazwa, rola, wartość", "A", K),
  c("4.1.3", "Komunikaty o stanie", "AA", K, FROM_21),
];

export const STANDARDS = ["WCAG 2.0", "WCAG 2.1", "WCAG 2.2"];
export const LEVELS = ["A", "AA", "AAA"];

const LEVELS_UP_TO = { A: ["A"], AA: ["A", "AA"], AAA: ["A", "AA", "AAA"] };

export function criteriaFor(standard, level) {
  const levels = LEVELS_UP_TO[level] || LEVELS_UP_TO.AA;
  return WCAG_CRITERIA.filter((item) => item.versions.includes(standard) && levels.includes(item.level));
}

export function criterionById(id) {
  return WCAG_CRITERIA.find((item) => item.id === id) || null;
}
