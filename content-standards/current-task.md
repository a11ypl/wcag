# Current task: 3.3.4 Zapobieganie błędom

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `3.3.4 Zapobieganie błędom — prawne, finansowe, dane`
- Plik HTML: `public/wcag-prostym-jezykiem/3-3-4-zapobieganie-bledom-prawne-finansowe-dane.html`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać:

- stronę kryterium `3.3.4`,
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
- innych plików pobocznych.

## Podstawa źródłowa do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `3.3.4 Error Prevention (Legal, Financial, Data)`
- Understanding WCAG 3.3.4
- How to Meet / Quick Reference dla 3.3.4
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.
Jeśli nie możesz potwierdzić techniki/failure, nie wpisuj jej do publicznego tutoriala. Zapisz uwagę w `source-qa`.

## Granice kryterium

3.3.4 dotyczy sytuacji, w których błąd użytkownika może mieć poważne skutki, np.:

- zobowiązanie prawne,
- transakcja finansowa,
- modyfikacja lub usunięcie danych użytkownika,
- wysłanie odpowiedzi testowych.

Nie mieszaj z:

- `3.3.1 Identyfikacja błędu` — wskazanie błędu po walidacji,
- `3.3.2 Etykiety lub instrukcje` — instrukcje przed wpisaniem danych,
- `3.3.3 Sugestie korekty błędów` — podpowiedzi poprawy wykrytego błędu,
- `3.3.6 Zapobieganie błędom — wszystkie` — szerszy wariant z WCAG 2.2,
- poradami prawnymi.

Opisuj wymóg dostępnościowy. Nie udzielaj porad prawnych.

## Sens kryterium prostym językiem

Użytkownik powinien mieć bezpieczny sposób, żeby uniknąć poważnego błędu. W praktyce system powinien zapewnić co najmniej jeden z mechanizmów:

- możliwość cofnięcia operacji,
- możliwość sprawdzenia i poprawienia danych przed wysłaniem,
- osobne potwierdzenie przed ostatecznym wysłaniem.

Nie przedstawiaj tych mechanizmów jako trzech obowiązkowych naraz. Kryterium wymaga bezpiecznego mechanizmu zapobiegania błędom w określonych sytuacjach.

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

Użytkownik powinien móc sprawdzić, poprawić, potwierdzić albo cofnąć dane, jeśli wysłanie formularza może mieć poważne skutki.

### Problem w praktyce

Uwzględnij przykłady:

- złożenie wniosku,
- wykonanie płatności lub przelewu,
- usunięcie konta,
- zmiana danych osobowych,
- wysłanie odpowiedzi testowych.

Problem: jeden nieuważny klik bez podsumowania, potwierdzenia albo możliwości cofnięcia może mieć realne konsekwencje.

### Dobry przykład

Uwzględnij:

- ekran podsumowania przed wysłaniem,
- przyciski `Edytuj` przy danych,
- osobne potwierdzenie operacji usunięcia,
- możliwość anulowania operacji,
- możliwość cofnięcia, jeśli operacja została wykonana,
- jasny komunikat `Sprawdź dane przed wysłaniem`.

### Zły przykład

Uwzględnij:

- jeden przycisk `Wyślij` bez podsumowania,
- operację `Usuń konto` wykonywaną natychmiast,
- brak możliwości poprawy danych,
- brak potwierdzenia operacji finansowej,
- brak informacji, że operacja jest ostateczna.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i `class="language-html"` albo właściwą klasę języka.

Preferowane przykłady:

1. Podsumowanie danych przed wysłaniem — `Kod — HTML`.
2. Linki/przyciski `Edytuj` przy poszczególnych danych — `Kod — HTML`.
3. Potwierdzenie operacji usunięcia konta — `Kod — HTML`.
4. Komunikat o możliwości cofnięcia operacji — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Jeśli pokazujesz proces, pokaż statyczny wzorzec HTML.

## Demo edukacyjne

Zrób statyczne demo, bez JS i bez udawania działającego procesu.

Demo ma pokazywać:

- `Źle`: wysłanie/operacja bez podsumowania i potwierdzenia,
- `Ryzykownie`: jest podsumowanie, ale nie ma jasnej edycji albo anulowania,
- `Dobrze`: jest podsumowanie, możliwość poprawy i jasne potwierdzenie/anulowanie.

Nie używaj prawdziwych inputów, jeśli demo nie jest działającym formularzem.
Użyj statycznych makiet.

Możliwe klasy CSS:

- `.wcag-error-prevention-demo`
- `.wcag-error-prevention-demo__grid`
- `.wcag-error-prevention-demo__item`
- `.wcag-error-prevention-demo__item--bad`
- `.wcag-error-prevention-demo__item--risky`
- `.wcag-error-prevention-demo__item--good`
- `.wcag-error-prevention-demo__summary`
- `.wcag-error-prevention-demo__action`
- `.wcag-error-prevention-demo__note`

Style muszą być scoped do `.wcag-error-prevention-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `3.3.1 Identyfikacja błędu`
- `3.3.2 Etykiety lub instrukcje`
- `3.3.3 Sugestie korekty błędów`
- `3.3.6 Zapobieganie błędom — wszystkie`
- `4.1.3 Komunikaty o stanie`
- `1.3.1 Informacje i relacje`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] 3.3.4 ma pełną strukturę tutorialową.
- [ ] 3.3.4 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo jest statyczne i nie udaje działającego formularza ani procesu.
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

`Expand WCAG 3.3.4 error prevention tutorial`
