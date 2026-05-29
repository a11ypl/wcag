# Current task: batch interakcje 2.1.4, 2.5.1, 2.5.2, 2.5.3, 2.5.4

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

- `2.1.4 Skróty klawiszowe znakowe` - poziom A
- `2.5.1 Gesty wskaźnika` - poziom A
- `2.5.2 Anulowanie wskazania` - poziom A
- `2.5.3 Etykieta w nazwie` - poziom A
- `2.5.4 Aktywowanie ruchem` - poziom A

Oczekiwane pliki:

- `public/wcag-prostym-jezykiem/2-1-4-skroty-klawiszowe-znakowe.html`
- `public/wcag-prostym-jezykiem/2-5-1-gesty-wskaznika.html`
- `public/wcag-prostym-jezykiem/2-5-2-anulowanie-wskazania.html`
- `public/wcag-prostym-jezykiem/2-5-3-etykieta-w-nazwie.html`
- `public/wcag-prostym-jezykiem/2-5-4-aktywowanie-ruchem.html`

## Zakres

Można zmieniać tylko:

- strony kryteriów `2.1.4`, `2.5.1`, `2.5.2`, `2.5.3`, `2.5.4`,
- scoped CSS dla demo edukacyjnych tych stron,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Granice

- `2.1.4` dotyczy jednoliterowych/jednoznakowych skrótów klawiaturowych, które mogą przeszkadzać użytkownikom.
- `2.5.1` dotyczy gestów wielopunktowych albo opartych na ścieżce, dla których trzeba dać prostszą alternatywę.
- `2.5.2` dotyczy tego, żeby użytkownik mógł anulować przypadkowe kliknięcie/dotknięcie albo żeby akcja nie wykonywała się za wcześnie.
- `2.5.3` dotyczy zgodności widocznej etykiety z dostępną nazwą elementu.
- `2.5.4` dotyczy funkcji uruchamianych ruchem urządzenia lub użytkownika, dla których musi być alternatywa i możliwość wyłączenia.

Nie mieszaj:

- `2.1.4` z ogólną obsługą klawiaturą,
- `2.5.1` z ruchem przeciągania `2.5.7`,
- `2.5.2` z potwierdzeniem błędów formularzy,
- `2.5.3` z samą widocznością tekstu,
- `2.5.4` z animacjami na stronie.

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

`Expand WCAG input interaction tutorials`
