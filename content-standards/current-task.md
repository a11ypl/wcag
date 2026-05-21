# Current task: 3.3.6 Zapobieganie błędom — wszystkie

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw znajdź realny plik HTML dla kryterium `3.3.6 Zapobieganie błędom — wszystkie` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/3-3-6-zapobieganie-bledom-wszystkie.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `3.3.6 Zapobieganie błędom — wszystkie`
- Poziom: `AAA`
- Plik HTML: realny plik 3.3.6 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać:

- stronę kryterium `3.3.6`,
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

Uwaga: jeśli `public/assets/styles.css` ma lokalne zmiany promocyjne niezwiązane z WCAG, nie mieszaj ich z tym taskiem. W razie potrzeby zatrzymaj się i opisz konflikt zakresu.

## Podstawa źródłowa do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `3.3.6 Error Prevention (All)`
- Understanding WCAG 3.3.6
- How to Meet / Quick Reference dla 3.3.6
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.
Jeśli nie możesz potwierdzić techniki/failure, nie wpisuj jej do publicznego tutoriala. Zapisz uwagę w `source-qa`.

## Granice kryterium

3.3.6 jest szerszą wersją 3.3.4. Dotyczy zapobiegania błędom przy przesyłaniu danych przez użytkownika — nie tylko w operacjach prawnych, finansowych, testowych albo modyfikujących dane.

Nie mieszaj z:

- `3.3.1 Identyfikacja błędu` — wskazanie błędu po walidacji,
- `3.3.2 Etykiety lub instrukcje` — instrukcje przed wpisaniem danych,
- `3.3.3 Sugestie korekty błędów` — podpowiedzi poprawy wykrytego błędu,
- `3.3.4 Zapobieganie błędom — prawne, finansowe, dane` — węższy wariant poziomu AA,
- `4.1.3 Komunikaty o stanie` — ogłaszanie statusu bez przenoszenia fokusu.

Nie przedstawiaj 3.3.6 jako wymogu AA. To poziom AAA.

## Sens kryterium prostym językiem

Jeśli użytkownik wysyła dane, powinien mieć możliwość uniknięcia błędu także wtedy, gdy skutki nie są formalnie prawne ani finansowe. System powinien dawać bezpieczny mechanizm: cofnięcie, sprawdzenie/poprawienie danych albo potwierdzenie przed wysłaniem.

Nie przedstawiaj wszystkich mechanizmów jako obowiązkowych naraz. Chodzi o zapewnienie sposobu zapobiegania błędom.

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

Gdy użytkownik wysyła dane, powinien mieć możliwość sprawdzenia, poprawienia, potwierdzenia albo cofnięcia działania, nawet jeśli nie chodzi o sprawy prawne lub finansowe.

### Problem w praktyce

Uwzględnij przykłady:

- wysłanie formularza kontaktowego,
- zapis do newslettera,
- publikacja komentarza,
- wysłanie zgłoszenia,
- zapis ustawień profilu,
- wysłanie ankiety.

Problem: użytkownik może wysłać błędne dane przez pomyłkę, a system nie daje mu żadnej możliwości sprawdzenia, poprawy ani cofnięcia.

### Dobry przykład

Uwzględnij:

- podsumowanie danych przed wysłaniem,
- możliwość edycji danych z podsumowania,
- jasny krok `Sprawdź i potwierdź`,
- możliwość anulowania,
- możliwość cofnięcia po wysłaniu, jeśli to pasuje do procesu,
- informację, co stanie się po potwierdzeniu.

### Zły przykład

Uwzględnij:

- formularz wysyłany od razu bez podsumowania,
- brak możliwości edycji danych po przejściu dalej,
- brak potwierdzenia w procesie wielokrokowym,
- brak informacji o skutku kliknięcia,
- komunikat sukcesu bez możliwości cofnięcia, gdy cofnięcie byłoby możliwe i pomocne.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i `class="language-html"` albo właściwą klasę języka.

Preferowane przykłady:

1. Krok podsumowania przed wysłaniem formularza — `Kod — HTML`.
2. Przycisk/link `Wróć do edycji` oraz `Potwierdzam i wysyłam` — `Kod — HTML`.
3. Komunikat po wysłaniu z możliwością cofnięcia — `Kod — HTML`.
4. Zły przykład: natychmiastowa wysyłka bez podsumowania — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Jeśli pokazujesz proces, pokaż statyczny wzorzec HTML.

## Demo edukacyjne

Zrób statyczne demo jako schemat procesu, nie makietę pojedynczego pola.

Demo ma pokazywać:

- `Źle`: Dane → Wyślij → Koniec, bez sprawdzenia i cofnięcia,
- `Ryzykownie`: Dane → Podsumowanie → Wyślij, ale bez jasnego powrotu do edycji,
- `Dobrze`: Dane → Podsumowanie → Edytuj / Potwierdź → Możliwość cofnięcia albo jasny koniec procesu.

To ma być statyczny schemat procesu.
Nie używaj prawdziwych inputów.
Nie udawaj działającego procesu.
Nie dodawaj JS.
Nie dodawaj ARIA bez potrzeby.

Możliwe klasy CSS:

- `.wcag-error-prevention-all-demo`
- `.wcag-error-prevention-all-demo__grid`
- `.wcag-error-prevention-all-demo__item`
- `.wcag-error-prevention-all-demo__item--bad`
- `.wcag-error-prevention-all-demo__item--risky`
- `.wcag-error-prevention-all-demo__item--good`
- `.wcag-error-prevention-all-demo__flow`
- `.wcag-error-prevention-all-demo__step`
- `.wcag-error-prevention-all-demo__note`

Style muszą być scoped do `.wcag-error-prevention-all-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `3.3.1 Identyfikacja błędu`
- `3.3.2 Etykiety lub instrukcje`
- `3.3.3 Sugestie korekty błędów`
- `3.3.4 Zapobieganie błędom — prawne, finansowe, dane`
- `4.1.3 Komunikaty o stanie`
- `1.3.1 Informacje i relacje`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 3.3.6.
- [ ] 3.3.6 ma pełną strukturę tutorialową.
- [ ] 3.3.6 ma jeden `h1`.
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

`Expand WCAG 3.3.6 error prevention all tutorial`
