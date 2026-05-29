# Current task: batch 2.2.1, 2.2.2, 2.3.1

## Polecenie dla Codexa

Wykonaj batch zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote.

Upewnij się, że HEAD zawiera commit `49be36c`.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Nie ruszaj stashy pobocznych.

## Zadanie

Rozbuduj kryteria:

- `2.2.1 Możliwość dostosowania czasu` - poziom A
- `2.2.2 Pauza, zatrzymanie, ukrycie` - poziom A
- `2.3.1 Trzy błyski lub wartości poniżej progu` - poziom A

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/2-2-1-mozliwosc-dostosowania-czasu.html`
- `public/wcag-prostym-jezykiem/2-2-2-pauza-zatrzymanie-ukrycie.html`
- `public/wcag-prostym-jezykiem/2-3-1-trzy-blyski-lub-wartosci-ponizej-progu.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `2.2.1`, `2.2.2`, `2.3.1`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `2.2.1` dotyczy limitów czasu i możliwości ich wyłączenia, wydłużenia albo dostosowania.
- `2.2.2` dotyczy treści, która się porusza, miga, przewija albo automatycznie aktualizuje.
- `2.3.1` dotyczy błysków mogących wywołać napad padaczkowy.

Nie mieszaj:

- `2.2.1` z ogólną walidacją formularzy,
- `2.2.2` z animacjami uruchamianymi ruchem urządzenia,
- `2.3.1` z samym dyskomfortem wizualnym albo kontrastem.

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

`Expand WCAG timing and flashing content tutorials`
