# Current task: 2.5.7 Ruch przeciągania

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote, bo `current-task.md` został zaktualizowany na GitHubie.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Znajdź realny plik HTML dla kryterium `2.5.7 Ruch przeciągania` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/2-5-7-ruch-przeciagania.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `2.5.7 Ruch przeciągania`
- Poziom: `AA`
- Plik HTML: realny plik 2.5.7 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać tylko:

- stronę kryterium `2.5.7`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Źródła do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `2.5.7 Dragging Movements`
- Understanding WCAG 2.5.7
- How to Meet / Quick Reference dla 2.5.7
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.

## Granice kryterium

2.5.7 dotyczy funkcji, które wymagają ruchu przeciągania. Jeśli funkcję można wykonać przeciąganiem, użytkownik powinien dostać alternatywny sposób wykonania tej samej funkcji bez przeciągania, chyba że przeciąganie jest istotą funkcji albo kryterium ma zastosowanie zgodnie z wyjątkami WCAG.

Nie mieszaj z:

- `2.5.1 Gesty wskazujące`,
- `2.1.1 Klawiatura`,
- `2.5.8 Rozmiar celu — minimum`,
- `2.5.2 Anulowanie akcji wskaźnikiem`,
- `1.4.10 Dopasowanie do ekranu`.

Nie opisuj 2.5.7 jako zakazu przeciągania. Przeciąganie może zostać, ale musi istnieć alternatywna droga.

## Sens prostym językiem

Jeśli użytkownik ma coś przeciągnąć, powinien dostać prostszy sposób wykonania tej samej czynności, np. przyciski, listę wyboru, menu akcji albo pole wartości.

## Wymagana struktura

Zbuduj pełny tutorial z sekcjami:

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

## Treść do ujęcia

Uwzględnij sytuacje:

- sortowanie elementów tylko przez drag and drop,
- zmiana kolejności kart tylko przeciąganiem,
- suwak bez alternatywy w postaci pola lub przycisków,
- wybór zakresu tylko przez przesuwanie uchwytów,
- ustawianie lokalizacji na mapie tylko przez przesuwanie pinezki,
- dodawanie pliku tylko przez przeciągnięcie do strefy.

Dobre wzorce:

- sortowanie przez przyciski `Przenieś w górę` i `Przenieś w dół`,
- suwak z polem liczbowym albo przyciskami zwiększ/zmniejsz,
- wybór pliku zwykłym przyciskiem jako alternatywa dla przeciągania,
- mapa z polem adresu albo listą lokalizacji,
- zmiana kolejności przez menu akcji,
- jasna informacja, że przeciąganie jest opcjonalne.

Złe wzorce:

- komunikat `Przeciągnij elementy, aby ustawić kolejność` bez alternatywy,
- komponent drag and drop bez przycisków albo menu akcji,
- suwak bez pola wartości i bez obsługi klawiatury,
- mapa wymagająca przesuwania pinezki bez pola adresu.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Sortowanie z przyciskami `Przenieś w górę` / `Przenieś w dół` — `Kod — HTML`.
2. Strefa przeciągania pliku z alternatywnym przyciskiem `Wybierz plik` — `Kod — HTML`.
3. Suwak z polem liczbowym jako alternatywą — `Kod — HTML`.
4. Zły przykład: instrukcja przeciągania bez alternatywy — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Jeśli pokazujesz zachowanie dynamiczne, opisz je jako wzorzec, a nie działającą funkcję strony.

## Demo edukacyjne

Zrób statyczne demo jako schemat funkcji wymagającej przeciągania i jej alternatywy.

Demo ma pokazywać:

- `Źle`: tylko przeciągnij element / brak innej drogi,
- `Ryzykownie`: przeciąganie jest główną drogą, a alternatywa jest ukryta albo niejasna,
- `Dobrze`: przeciąganie jest opcjonalne, a obok są jasne przyciski, lista wyboru albo pole wartości.

Nie dodawaj JS. Nie rób prawdziwego drag and drop. Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby. Nie przekazuj oceny tylko kolorem.

Możliwe klasy CSS:

- `.wcag-dragging-demo`
- `.wcag-dragging-demo__grid`
- `.wcag-dragging-demo__item`
- `.wcag-dragging-demo__item--bad`
- `.wcag-dragging-demo__item--risky`
- `.wcag-dragging-demo__item--good`
- `.wcag-dragging-demo__flow`
- `.wcag-dragging-demo__drag-item`
- `.wcag-dragging-demo__alternative`
- `.wcag-dragging-demo__note`

Style muszą być scoped do `.wcag-dragging-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `2.1.1 Klawiatura`
- `2.5.1 Gesty wskazujące`
- `2.5.2 Anulowanie akcji wskaźnikiem`
- `2.5.8 Rozmiar celu — minimum`
- `2.4.7 Widoczny fokus`
- `4.1.2 Nazwa, rola, wartość`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 2.5.7.
- [ ] 2.5.7 ma pełną strukturę tutorialową.
- [ ] 2.5.7 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo jest statycznym schematem przeciągania i alternatywy.
- [ ] Demo nie udaje działającego komponentu drag and drop.
- [ ] Powiązane kryteria są linkami.
- [ ] Brak martwych linków lokalnych.
- [ ] Style demo są scoped.
- [ ] Linki w treści nadal są fioletowe, pogrubione i podkreślone.
- [ ] Metadane hero są czytelne.
- [ ] Publiczna sekcja `Źródła` zawiera tylko źródła merytoryczne.
- [ ] Techniki i failures nie zostały dopisane bez weryfikacji.
- [ ] Status został zaktualizowany.
- [ ] Source QA został zaktualizowany.

## Commit

Commit message po wykonaniu rozbudowy:

`Expand WCAG 2.5.7 dragging movements tutorial`
