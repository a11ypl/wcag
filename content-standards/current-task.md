# Current task: batch multimedia 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5

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

- `1.2.1 Tylko audio oraz tylko wideo` - poziom A
- `1.2.2 Napisy rozszerzone` - poziom A
- `1.2.3 Audiodeskrypcja lub alternatywa dla mediów` - poziom A
- `1.2.4 Napisy rozszerzone na żywo` - poziom AA
- `1.2.5 Audiodeskrypcja` - poziom AA

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/1-2-1-tylko-audio-oraz-tylko-wideo.html`
- `public/wcag-prostym-jezykiem/1-2-2-napisy-rozszerzone.html`
- `public/wcag-prostym-jezykiem/1-2-3-audiodeskrypcja-lub-alternatywa-dla-mediow.html`
- `public/wcag-prostym-jezykiem/1-2-4-napisy-rozszerzone-na-zywo.html`
- `public/wcag-prostym-jezykiem/1-2-5-audiodeskrypcja.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `1.2.1`, `1.2.2`, `1.2.3`, `1.2.4`, `1.2.5`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `1.2.1` dotyczy alternatyw dla nagrań tylko audio albo tylko wideo.
- `1.2.2` dotyczy napisów rozszerzonych dla nagrań z dźwiękiem.
- `1.2.3` dotyczy audiodeskrypcji albo alternatywy tekstowej dla nagrania wideo.
- `1.2.4` dotyczy napisów rozszerzonych na żywo.
- `1.2.5` dotyczy audiodeskrypcji dla nagrań wideo.

Pilnuj różnic:

- napisy to nie transkrypcja,
- transkrypcja to nie audiodeskrypcja,
- audiodeskrypcja opisuje ważne informacje wizualne,
- alternatywa dla mediów musi przekazywać sens całego nagrania,
- kryteria dla nagrań i transmisji na żywo mają różne wymagania.

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
- przykłady kodu z etykietami języka, jeśli mają sens,
- `code` z klasami `language-*`,
- powiązane kryteria jako linki tylko do istniejących stron,
- źródła W3C po weryfikacji,
- brak JavaScriptu,
- brak ARIA bez potrzeby,
- style demo tylko scoped do konkretnego demo.

## Commit

Commit message po wykonaniu batcha:

`Expand WCAG multimedia tutorials`
