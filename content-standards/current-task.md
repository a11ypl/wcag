# Current task: 2.5.8 Rozmiar celu — minimum

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

Znajdź realny plik HTML dla kryterium `2.5.8 Rozmiar celu — minimum` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/2-5-8-rozmiar-celu-minimum.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `2.5.8 Rozmiar celu — minimum`
- Poziom: `AA`
- Plik HTML: realny plik 2.5.8 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać tylko:

- stronę kryterium `2.5.8`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Źródła do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `2.5.8 Target Size (Minimum)`
- Understanding WCAG 2.5.8
- How to Meet / Quick Reference dla 2.5.8
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.

## Granice kryterium

2.5.8 dotyczy minimalnego rozmiaru celu dla działań wskaźnikiem, np. myszą, dotykiem albo rysikiem. Cel powinien mieć co najmniej 24 na 24 piksele CSS albo mieć wystarczający odstęp od innych celów, zgodnie z warunkami kryterium.

Nie mieszaj z:

- `2.5.5 Rozmiar celu` — poziom AAA, większy wymóg 44 na 44 CSS px,
- `2.5.7 Ruch przeciągania` — alternatywa dla przeciągania,
- `2.5.2 Anulowanie akcji wskaźnikiem` — anulowanie kliknięcia/dotknięcia,
- `1.4.11 Kontrast elementów nietekstowych` — widoczność granic i stanów,
- `2.4.7 Widoczny fokus` — widoczność fokusu klawiatury.

Nie opisuj 2.5.8 jako wymagania, że każdy widoczny przycisk musi mieć fizyczny prostokąt 24 na 24. Liczy się cel aktywny oraz odstępy/warunki kryterium. Uwzględnij wyjątki ostrożnie i tylko po sprawdzeniu źródeł W3C.

## Sens prostym językiem

Elementy, które użytkownik klika albo dotyka, nie mogą być zbyt małe ani upchane tak blisko siebie, że łatwo trafić w zły element.

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

- małe ikonki akcji w tabeli,
- linki lub przyciski ustawione bardzo blisko siebie,
- małe przyciski zamykania i rozwijania,
- paginacja z małymi numerami stron,
- małe kontrolki w mapie, kalendarzu albo filtrach,
- ikony w kartach produktów albo listach wyników.

Dobre wzorce:

- cel aktywny co najmniej 24 na 24 px CSS,
- powiększenie obszaru klikalnego bez zmiany wyglądu ikony,
- odstępy między małymi celami,
- większy padding w przyciskach i linkach ikonowych,
- czytelne grupowanie akcji,
- rezygnacja z ciasnych ikon w tabelach na rzecz menu akcji albo większych kontrolek.

Złe wzorce:

- ikony 16 na 16 px jako jedyny obszar kliknięcia,
- kilka małych ikon obok siebie bez odstępu,
- ciasna paginacja,
- mały przycisk `x` bez większego obszaru aktywnego,
- linki w tekście albo na liście tak blisko siebie, że trudno trafić w poprawny.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Przycisk ikonowy z większym obszarem aktywnym — `Kod — HTML` i/lub `Kod — CSS`.
2. Lista akcji z zachowanym odstępem między celami — `Kod — HTML` i/lub `Kod — CSS`.
3. Zły przykład: małe ikonki akcji bez paddingu i odstępu — `Kod — HTML` albo `Kod — CSS`.
4. Dobre rozwiązanie dla paginacji albo menu akcji — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu.

## Demo edukacyjne

Zrób statyczne demo jako porównanie małych/cieśnych celów i poprawionych celów.

Demo ma pokazywać:

- `Źle`: kilka małych ikon bardzo blisko siebie, łatwo trafić w złą akcję,
- `Ryzykownie`: ikony są nieco większe, ale odstęp nadal jest mały albo cel aktywny jest niejasny,
- `Dobrze`: obszary aktywne mają co najmniej 24 na 24 px CSS albo mają wyraźny odstęp i czytelną strukturę.

To ma być statyczny schemat.
Nie dodawaj JS. Nie dodawaj prawdziwych kontrolek, jeśli demo nie jest działające. Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby. Nie przekazuj oceny tylko kolorem.

Możliwe klasy CSS:

- `.wcag-target-size-demo`
- `.wcag-target-size-demo__grid`
- `.wcag-target-size-demo__item`
- `.wcag-target-size-demo__item--bad`
- `.wcag-target-size-demo__item--risky`
- `.wcag-target-size-demo__item--good`
- `.wcag-target-size-demo__targets`
- `.wcag-target-size-demo__target`
- `.wcag-target-size-demo__target-area`
- `.wcag-target-size-demo__note`

Style muszą być scoped do `.wcag-target-size-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `2.5.7 Ruch przeciągania`
- `2.5.2 Anulowanie akcji wskaźnikiem`
- `2.4.7 Widoczny fokus`
- `1.4.11 Kontrast elementów nietekstowych`
- `2.4.13 Wygląd fokusu`
- `1.4.10 Dopasowanie do ekranu`

Nie linkuj do `2.5.5`, jeśli nie istnieje albo jeśli nie chcemy wchodzić teraz w AAA.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 2.5.8.
- [ ] 2.5.8 ma pełną strukturę tutorialową.
- [ ] 2.5.8 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo jest statycznym porównaniem małych/cieśnych celów i poprawionych celów.
- [ ] Demo nie udaje działającego komponentu.
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

`Expand WCAG 2.5.8 target size tutorial`
