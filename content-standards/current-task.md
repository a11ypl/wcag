# Current task: batch 4.1.1, 4.1.2, 4.1.3

## Polecenie dla Codexa

Wykonaj batch zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote.

Upewnij się, że HEAD zawiera commit `6dd6ade`.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Nie ruszaj stashy pobocznych.

## Zadanie

Rozbuduj kryteria:

- `4.1.1 Parsowanie` - poziom A
- `4.1.2 Nazwa, rola, wartość` - poziom A
- `4.1.3 Komunikaty o stanie` - poziom AA

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/4-1-1-parsowanie.html`
- `public/wcag-prostym-jezykiem/4-1-2-nazwa-rola-wartosc.html`
- `public/wcag-prostym-jezykiem/4-1-3-komunikaty-o-stanie.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `4.1.1`, `4.1.2`, `4.1.3`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `4.1.1` dotyczy poprawności kodu i parsowania; w WCAG 2.2 kryterium jest przestarzałe i usunięte.
- `4.1.2` dotyczy tego, czy elementy interfejsu mają programowo dostępną nazwę, rolę i wartość.
- `4.1.3` dotyczy komunikatów o stanie przekazywanych bez przenoszenia fokusu.

Nie mieszaj:

- `4.1.1` z ogólną jakością HTML,
- `4.1.2` z samym tekstem widocznym na ekranie,
- `4.1.3` z komunikatami błędów formularza z `3.3.1`.

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
- w treści pokazać zasadę: najpierw natywny HTML, ARIA tylko gdy naprawdę potrzebna,
- style demo tylko scoped do konkretnego demo.

## Commit

Commit message po wykonaniu batcha:

`Expand WCAG compatibility tutorials`
