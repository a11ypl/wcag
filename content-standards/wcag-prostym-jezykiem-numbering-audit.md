# Audyt numeracji WCAG prostym językiem

Data: 2026-09-04

## Cel

Sprawdzić poprawność numeracji w całej sekcji `WCAG prostym językiem` oraz dodać przy kryteriach informację, w których wersjach wytycznych występują: WCAG 2.0, WCAG 2.1, WCAG 2.2.

## Zakres

- `public/wcag-prostym-jezykiem.html`
- `public/wcag-prostym-jezykiem/*.html`
- `vercel.json`
- `scripts/wcag_criteria_data.py`
- `scripts/generate_wcag_plain_language.py`
- skrypt kontrolny `scripts/check_wcag_navigation.py`

## Źródła merytoryczne

- WCAG 2.0: `https://www.w3.org/TR/WCAG20/`
- WCAG 2.1: `https://www.w3.org/TR/WCAG21/`
- Nowe kryteria WCAG 2.1: `https://www.w3.org/WAI/standards-guidelines/wcag/new-in-21/`
- WCAG 2.2: `https://www.w3.org/TR/WCAG22/`
- Nowe kryteria WCAG 2.2: `https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/`

## Wynik audytu przed poprawkami

- W katalogu było 97 plików HTML dla podstron kryteriów.
- Pliki obejmowały 87 unikalnych numerów kryteriów.
- 10 plików było duplikatami starszych slugów dla tego samego numeru kryterium.
- Strona zbiorcza pokazywała 58 kryteriów, mimo że w katalogu istniał komplet 87 unikalnych numerów.
- Część nawigacji `Poprzednie / Następne` pomijała istniejące kryteria, szczególnie kryteria AAA oraz część kryteriów dodanych w WCAG 2.1 i WCAG 2.2.
- Najbardziej widoczny błąd: po `2.1.4` link prowadził bezpośrednio do `2.5.1`, zamiast do `2.2.1`.

## Decyzje

- Strona zbiorcza ma pokazywać pełną listę 87 unikalnych kryteriów dostępnych w sekcji.
- Nawigacja między kryteriami ma iść zgodnie z pełną numeracją WCAG 2.x.
- Stare warianty slugów mają zostać obsłużone redirectami do kanonicznych URL-i.
- `4.1.1 Parsowanie` zostaje w bazie jako kryterium historyczne: występuje w WCAG 2.0 i WCAG 2.1, a w WCAG 2.2 zostało usunięte.
- Dane wspólne dla kryterium (numer, slug, tytuł, poziom, sekcja i wersje WCAG) są utrzymywane tylko w `scripts/wcag_criteria_data.py`.

## Generowanie plików

Po zmianie katalogu kryteriów uruchom:

```bash
python3 scripts/generate_wcag_plain_language.py
```

Generator aktualizuje stronę zbiorczą oraz wspólne dane na podstronach: tytuł, okruszki, sekcję, poziom, informację o wersjach WCAG i nawigację `Poprzednie / Następne`. Merytoryczne opisy kryteriów pozostają w osobnych plikach HTML.

Przed wdrożeniem sprawdź, czy pliki są już wygenerowane:

```bash
python3 scripts/generate_wcag_plain_language.py --check
```

## Kontrola automatyczna

Dodano skrypt:

```bash
python3 scripts/check_wcag_navigation.py
```

Skrypt sprawdza:

- komplet 87 znanych kryteriów WCAG 2.x,
- zgodność listy, tytułów, poziomów, wersji i adresów ze wspólnym katalogiem danych,
- zgodność numeru w slugu z `h1`, okruszkami i tytułem na każdej podstronie,
- informację o wersjach WCAG na każdej podstronie,
- nawigację `Poprzednie / Następne` zgodną z katalogiem,
- redirecty dla duplikatów starych slugów.

## Wynik po poprawkach

```text
OK: 87 kryteriów, indeks, podstrony, nawigacja, wersje WCAG i przekierowania są zgodne z jednym źródłem danych.
```

## Znane ograniczenia

- Sekcja nadal jest publikowana jako statyczny HTML. Jedno źródło danych obejmuje elementy wspólne; pełne opisy merytoryczne pozostają w plikach poszczególnych artykułów.
- Skrypt kontrolny pilnuje numeracji, wersji, redirectów i nawigacji, ale nie ocenia jakości merytorycznej pełnych opisów każdego kryterium.
- Duplikaty starych slugów nadal istnieją jako pliki, ale kanoniczne wejścia są obsłużone redirectami w `vercel.json`.
