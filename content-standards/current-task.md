# Current task: batch 2.4.5, 2.4.6, 3.1.1, 3.1.2

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

- `2.4.5 Wiele sposobów` - poziom AA
- `2.4.6 Nagłówki i etykiety` - poziom AA
- `3.1.1 Język strony` - poziom A
- `3.1.2 Język części` - poziom AA

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/2-4-5-wiele-sposobow.html`
- `public/wcag-prostym-jezykiem/2-4-6-naglowki-i-etykiety.html`
- `public/wcag-prostym-jezykiem/3-1-1-jezyk-strony.html`
- `public/wcag-prostym-jezykiem/3-1-2-jezyk-czesci.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `2.4.5`, `2.4.6`, `3.1.1`, `3.1.2`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `2.4.5` dotyczy zapewnienia więcej niż jednego sposobu dotarcia do strony, np. menu, wyszukiwarka, mapa strony, lista linków.
- `2.4.6` dotyczy tego, żeby nagłówki i etykiety opisywały temat albo cel.
- `3.1.1` dotyczy ustawienia głównego języka strony.
- `3.1.2` dotyczy oznaczania fragmentów w innym języku.

Nie mieszaj:

- `2.4.5` z samą kolejnością menu,
- `2.4.6` z hierarchią nagłówków z `1.3.1`,
- `3.1.1` z jakością tłumaczenia,
- `3.1.2` z pojedynczymi nazwami własnymi, które nie wymagają oznaczania.

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

`Expand WCAG navigation and language tutorials`
