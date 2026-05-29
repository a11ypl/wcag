# Current task: batch 1.3.4, 1.4.2, 2.4.13, 3.2.6

## Polecenie dla Codexa

Wykonaj batch zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote.

Upewnij się, że HEAD zawiera commit `526a2ee`.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Nie ruszaj stashy pobocznych.

## Zadanie

Rozbuduj kryteria:

- `1.3.4 Orientacja` - poziom AA
- `1.4.2 Kontrola odtwarzania dźwięku` - poziom A
- `2.4.13 Wygląd fokusu` - poziom AAA według WCAG 2.2
- `3.2.6 Spójna pomoc` - poziom A

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/1-3-4-orientacja.html`
- `public/wcag-prostym-jezykiem/1-4-2-kontrola-odtwarzania-dzwieku.html`
- `public/wcag-prostym-jezykiem/2-4-13-wyglad-fokusu.html`
- `public/wcag-prostym-jezykiem/3-2-6-spojna-pomoc.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `1.3.4`, `1.4.2`, `2.4.13`, `3.2.6`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `1.3.4` dotyczy tego, że treść nie może wymagać jednej orientacji ekranu, jeśli nie jest to niezbędne.
- `1.4.2` dotyczy dźwięku odtwarzanego automatycznie dłużej niż 3 sekundy i mechanizmu zatrzymania, wyciszenia albo kontroli głośności niezależnej od systemu.
- `2.4.13` dotyczy rozmiaru i kontrastu widocznego wskaźnika fokusu; w WCAG 2.2 ma poziom AAA.
- `3.2.6` dotyczy spójnej lokalizacji lub kolejności mechanizmów pomocy, jeśli występują na wielu stronach.

Nie mieszaj:

- `1.3.4` z responsywnością z `1.4.10`,
- `1.4.2` z napisami albo transkrypcją,
- `2.4.13` z samym `2.4.7 Widoczny fokus`,
- `3.2.6` z ogólną jakością kontaktu albo supportu.

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

`Expand remaining WCAG A and AA support tutorials`
