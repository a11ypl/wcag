# Current task: 3.3.7 Powtarzające się wpisy

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote, bo `current-task.md` został zaktualizowany na GitHubie.

Uwaga: lokalnie może istnieć niecommitowana zmiana promocyjna w `public/assets/styles.css`. Nie commituj jej i nie mieszaj z taskiem WCAG. Jeśli blokuje pracę, odseparuj ją bez utraty albo zatrzymaj się i opisz problem.

Następnie znajdź realny plik HTML dla kryterium `3.3.7 Powtarzające się wpisy` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/3-3-7-powtarzajace-sie-wpisy.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `3.3.7 Powtarzające się wpisy`
- Poziom: `A`
- Plik HTML: realny plik 3.3.7 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać:

- stronę kryterium `3.3.7`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA.

Nie zmieniać:

- innych kryteriów,
- listy kryteriów,
- routingu,
- headera,
- footera,
- canonicali,
- globalnej architektury strony,
- plików spoza zakresu.

Nie commitować:

- `.vercel/`,
- `Czytniki ekranu/`,
- `cms/`,
- `ola.jfif`,
- lokalnych zmian promocyjnych w `public/assets/styles.css`, jeśli nadal są niecommitowane,
- innych plików pobocznych.

## Podstawa źródłowa do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `3.3.7 Redundant Entry`
- Understanding WCAG 3.3.7
- How to Meet / Quick Reference dla 3.3.7
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.
Jeśli nie możesz potwierdzić techniki/failure, nie wpisuj jej do publicznego tutoriala. Zapisz uwagę w `source-qa`.

## Granice kryterium

3.3.7 dotyczy sytuacji, w których użytkownik musiałby ponownie wpisać tę samą informację w tym samym procesie. System powinien automatycznie uzupełnić wcześniej podane dane albo udostępnić je do wyboru.

Nie mieszaj z:

- `3.3.2 Etykiety lub instrukcje` — instrukcje przed wpisaniem danych,
- `3.3.4` i `3.3.6` — zapobieganie błędom przed skutkiem,
- `1.3.5 Określenie celu danych wejściowych` — autocomplete i cel danych osobowych,
- `1.3.1 Informacje i relacje` — semantyczne relacje w kodzie.

Uwzględnij wyjątki: ponowne wpisanie może być wymagane, jeśli jest niezbędne, związane z bezpieczeństwem, albo poprzednia informacja nie jest już ważna.

## Sens kryterium prostym językiem

Jeśli użytkownik raz podał informację w danym procesie, nie powinien być zmuszany do wpisywania jej drugi raz bez powodu. System powinien ją przenieść, zaproponować albo dać możliwość wyboru.

## Oczekiwana struktura tutoriala

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

## Treść, którą trzeba ująć

### Krótko

Nie każ użytkownikowi ponownie wpisywać tej samej informacji, jeśli system już ją zna i może bezpiecznie użyć jej ponownie.

### Problem w praktyce

Uwzględnij przykłady:

- formularz dostawy i faktury,
- dane kontaktowe podawane w kilku krokach,
- numer sprawy wpisywany ponownie w dalszym kroku,
- adres e-mail wpisywany kilka razy w tym samym procesie,
- te same dane osoby kontaktowej w kilku sekcjach.

Problem: powtarzanie danych zwiększa ryzyko błędu i obciąża szczególnie osoby z trudnościami ruchowymi, poznawczymi, pamięciowymi albo korzystające z technologii wspomagających.

### Dobry przykład

Uwzględnij:

- checkbox `Adres do faktury taki sam jak adres dostawy`,
- przeniesienie wcześniej podanych danych do kolejnego kroku,
- wybór z wcześniej podanych danych,
- możliwość edycji skopiowanych danych,
- jasne oznaczenie, skąd pochodzą dane.

### Zły przykład

Uwzględnij:

- ponowne ręczne wpisywanie adresu,
- brak opcji użycia wcześniejszych danych,
- wymuszanie ponownego wpisania numeru sprawy,
- kilka takich samych pól w jednym procesie,
- kopiowanie danych przez użytkownika między krokami.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i `class="language-html"` albo właściwą klasę języka.

Preferowane przykłady:

1. Checkbox `Adres do faktury taki sam jak adres dostawy` — `Kod — HTML`.
2. Podsumowanie z wyborem wcześniej podanego adresu — `Kod — HTML`.
3. Zły przykład: ponowne wpisywanie tych samych danych bez opcji użycia wcześniejszych — `Kod — HTML`.
4. Informacja, że dane zostały przeniesione i można je edytować — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Jeśli pokazujesz proces, pokaż statyczny wzorzec HTML.

## Demo edukacyjne

Zrób statyczne demo jako schemat procesu, nie działający formularz.

Demo ma pokazywać:

- `Źle`: Krok 1 — wpisz adres → Krok 2 — wpisz ten sam adres ponownie,
- `Ryzykownie`: Krok 1 — wpisz adres → Krok 2 — adres skopiowany, ale bez informacji i bez edycji,
- `Dobrze`: Krok 1 — wpisz adres → Krok 2 — użyj tego samego adresu / wybierz z wcześniej podanych / edytuj.

To ma być statyczny schemat procesu.
Nie używaj prawdziwych inputów.
Nie udawaj działającego procesu.
Nie dodawaj JS.
Nie dodawaj ARIA bez potrzeby.

Możliwe klasy CSS:

- `.wcag-redundant-entry-demo`
- `.wcag-redundant-entry-demo__grid`
- `.wcag-redundant-entry-demo__item`
- `.wcag-redundant-entry-demo__item--bad`
- `.wcag-redundant-entry-demo__item--risky`
- `.wcag-redundant-entry-demo__item--good`
- `.wcag-redundant-entry-demo__flow`
- `.wcag-redundant-entry-demo__step`
- `.wcag-redundant-entry-demo__note`

Style muszą być scoped do `.wcag-redundant-entry-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `1.3.5 Określenie celu danych wejściowych`
- `3.3.2 Etykiety lub instrukcje`
- `3.3.4 Zapobieganie błędom — prawne, finansowe, dane`
- `3.3.6 Zapobieganie błędom — wszystkie`
- `4.1.3 Komunikaty o stanie`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 3.3.7.
- [ ] 3.3.7 ma pełną strukturę tutorialową.
- [ ] 3.3.7 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo jest statycznym schematem procesu.
- [ ] Demo nie udaje działającego formularza ani procesu.
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

`Expand WCAG 3.3.7 redundant entry tutorial`
