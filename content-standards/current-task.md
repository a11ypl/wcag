# Current task: batch 3.2.1, 3.2.2, 3.2.3, 3.2.4

## Polecenie dla Codexa

Wykonaj batch zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Nie ruszaj stashy pobocznych.

## Zadanie

Rozbuduj kryteria:

- `3.2.1 Po otrzymaniu fokusu` - poziom A
- `3.2.2 Podczas wprowadzania danych` - poziom A
- `3.2.3 Spójna nawigacja` - poziom AA
- `3.2.4 Spójna identyfikacja` - poziom AA

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/3-2-1-po-otrzymaniu-fokusu.html`
- `public/wcag-prostym-jezykiem/3-2-2-podczas-wprowadzania-danych.html`
- `public/wcag-prostym-jezykiem/3-2-3-spojna-nawigacja.html`
- `public/wcag-prostym-jezykiem/3-2-4-spojna-identyfikacja.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `3.2.1`, `3.2.2`, `3.2.3`, `3.2.4`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `3.2.1` dotyczy tego, że samo otrzymanie fokusu nie może wywołać nieoczekiwanej zmiany kontekstu.
- `3.2.2` dotyczy tego, że zmiana wartości pola lub formularza nie może automatycznie wywołać nieoczekiwanej zmiany kontekstu bez uprzedzenia.
- `3.2.3` dotyczy spójnej kolejności powtarzanej nawigacji na wielu stronach, jeśli użytkownik sam jej nie zmieni.
- `3.2.4` dotyczy spójnego identyfikowania elementów o tej samej funkcji.

Nie mieszaj:

- `3.2.1` z samą widocznością fokusu,
- `3.2.2` z walidacją formularza,
- `3.2.3` z ogólną jakością menu,
- `3.2.4` z identycznym wyglądem graficznym każdego elementu.

## Wymagana struktura dla każdego kryterium

- `Krótko`
- `Problem w praktyce`
- `Kogo to dotyczy`
- `Dobry przykład`
- `Zły przykład`
- `Przykłady kodu`
- `Przykład graficzny` albo demo edukacyjne
- `Jak sprawdzić`
- `Co sprawdzi automat, a czego nie`
- `Typowe błędy`
- `Powiązane kryteria`
- `Źródła`

## Wymagania techniczne

- jeden `h1` na stronie,
- logiczna hierarchia nagłówków,
- przykłady kodu z etykietami języka,
- `code` z klasami `language-*`,
- powiązane kryteria jako linki tylko do istniejących stron,
- źródła W3C po weryfikacji,
- brak JavaScriptu dodawanego dla demo,
- brak ARIA bez potrzeby,
- style demo tylko scoped do konkretnego demo.

## Commit

Commit message po wykonaniu batcha:

`Expand WCAG predictable interface tutorials`
