# Current task: batch 1.4.5, 1.4.10, 1.4.12

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

Nie ruszaj stashu pobocznego.

## Zadanie

Rozbuduj kryteria:

- `1.4.5 Obrazy tekstu` - poziom AA
- `1.4.10 Dopasowanie do ekranu` - poziom AA
- `1.4.12 Odstępy w tekście` - poziom AA

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/1-4-5-obrazy-tekstu.html`
- `public/wcag-prostym-jezykiem/1-4-10-dopasowanie-do-ekranu.html`
- `public/wcag-prostym-jezykiem/1-4-12-odstepy-w-tekscie.html`

Jeśli pliki nie istnieją, utwórz je pod slugami już używanymi w nawigacji i powiązanych kryteriach.

## Zakres

Można zmieniać tylko:

- strony kryteriów `1.4.5`, `1.4.10`, `1.4.12`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `1.4.5` dotyczy unikania obrazów tekstu, gdy tekst może być prawdziwym tekstem.
- `1.4.10` dotyczy dopasowania treści do ekranu bez przewijania w dwóch kierunkach.
- `1.4.12` dotyczy działania treści po zmianie odstępów w tekście.

Nie mieszaj:

- `1.4.5` z tekstem alternatywnym z `1.1.1`,
- `1.4.10` z samym RWD jako ogólną jakością UI,
- `1.4.12` z `1.4.4 Zmiana rozmiaru tekstu`.

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

`Expand WCAG visual text and layout tutorials`
