# Current task: batch 2.4.1, 2.4.2, 2.4.4

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

- `2.4.1 Możliwość pominięcia bloków` - poziom A
- `2.4.2 Tytuł strony` - poziom A
- `2.4.4 Cel linku w kontekście` - poziom A

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/2-4-1-mozliwosc-pominiecia-blokow.html`
- `public/wcag-prostym-jezykiem/2-4-2-tytul-strony.html`
- `public/wcag-prostym-jezykiem/2-4-4-cel-linku-w-kontekscie.html`

Jeśli pliki nie istnieją, utwórz je pod slugami już używanymi w nawigacji i powiązanych kryteriach.

## Zakres

Można zmieniać tylko:

- strony kryteriów `2.4.1`, `2.4.2`, `2.4.4`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `2.4.1` dotyczy możliwości pominięcia powtarzalnych bloków, np. menu, nagłówka, filtrów.
- `2.4.2` dotyczy sensownego tytułu strony w `title`.
- `2.4.4` dotyczy tego, czy cel linku da się zrozumieć z samego linku albo z kontekstu.

Nie mieszaj:

- `2.4.1` z ogólną strukturą nagłówków,
- `2.4.2` z `h1`,
- `2.4.4` z wyglądem linków albo kontrastem.

## Wymagana struktura dla każdego kryterium

- `Krótko`
- `Problem w praktyce`
- `Kogo to dotyczy`
- `Dobry przykład`
- `Zły przykład`
- `Przykłady kodu`
- `Przykład graficzny` albo demo edukacyjne, jeśli ma sens
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

`Expand WCAG navigation basics tutorials`
