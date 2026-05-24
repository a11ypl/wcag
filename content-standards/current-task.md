# Current task: 1.3.5 Określenie celu danych wejściowych

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

Znajdź realny plik HTML dla kryterium `1.3.5 Określenie celu danych wejściowych` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/1-3-5-okreslenie-celu-danych-wejsciowych.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `1.3.5 Określenie celu danych wejściowych`
- Poziom: `AA`
- Plik HTML: realny plik 1.3.5 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać tylko:

- stronę kryterium `1.3.5`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Źródła do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `1.3.5 Identify Input Purpose`
- Understanding WCAG 1.3.5
- How to Meet / Quick Reference dla 1.3.5
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.

## Granice kryterium

1.3.5 dotyczy pól zbierających dane o użytkowniku, dla których cel można określić programowo, zwykle przez poprawny atrybut `autocomplete` z listy HTML.

Nie mieszaj z:

- `3.3.2 Etykiety lub instrukcje` — widoczne etykiety i instrukcje formularza,
- `1.3.1 Informacje i relacje` — ogólne relacje w kodzie,
- `4.1.2 Nazwa, rola, wartość` — dostępna nazwa i rola komponentu,
- `3.3.8 Dostępne uwierzytelnianie — minimum` — proces logowania,
- walidacją poprawności danych.

Nie opisuj 1.3.5 jako wymagania, że każde pole musi mieć `autocomplete`. Kryterium dotyczy tylko określonych danych wejściowych o użytkowniku, gdy cel pola odpowiada wartościom z listy autocomplete.

## Sens prostym językiem

Jeśli formularz pyta o typowe dane użytkownika, takie jak imię, e-mail, telefon albo adres, kod powinien jasno mówić, jaki jest cel pola. Dzięki temu przeglądarka i technologie wspomagające mogą pomóc użytkownikowi szybciej i pewniej uzupełnić formularz.

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

- pole e-mail bez `autocomplete="email"`,
- pole imienia bez `autocomplete="given-name"`,
- pole nazwiska bez `autocomplete="family-name"`,
- pole telefonu bez `autocomplete="tel"`,
- pola adresu bez odpowiednich wartości autocomplete,
- błędne wartości autocomplete albo użycie własnych nazw,
- kilka pól o podobnej etykiecie, ale różnym celu.

Dobre wzorce:

- `autocomplete="given-name"` dla imienia,
- `autocomplete="family-name"` dla nazwiska,
- `autocomplete="email"` dla adresu e-mail,
- `autocomplete="tel"` dla telefonu,
- `autocomplete="street-address"`, `address-level2`, `postal-code`, `country-name` dla danych adresowych,
- oddzielne wartości dla danych rozliczeniowych i wysyłkowych, jeśli są potrzebne, np. `billing` i `shipping`, po weryfikacji w źródłach HTML/W3C,
- widoczna etykieta nadal pozostaje potrzebna.

Złe wzorce:

- brak `autocomplete` przy polach danych osobowych,
- `autocomplete="name"` użyte tam, gdzie pole zbiera tylko imię albo tylko nazwisko,
- wymyślone wartości, np. `autocomplete="user-email"`,
- placeholder jako jedyna informacja o celu pola,
- to samo `autocomplete` na polach o różnych celach,
- wyłączanie autouzupełniania bez uzasadnienia.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Formularz kontaktowy z poprawnym `autocomplete` dla imienia, e-maila i telefonu — `Kod — HTML`.
2. Formularz adresowy z poprawnymi wartościami `autocomplete` — `Kod — HTML`.
3. Zły przykład: pola danych osobowych bez `autocomplete` albo z wymyślonymi wartościami — `Kod — HTML`.
4. Przykład rozróżnienia adresu dostawy i adresu rozliczeniowego, jeśli można to poprawnie potwierdzić w źródłach — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Nie dodawaj ARIA, jeśli wystarczy natywny HTML.

## Demo edukacyjne

Zrób statyczne demo jako porównanie formularza bez określonego celu pól i formularza z poprawnym celem pól.

Demo ma pokazywać:

- `Źle`: pola wyglądają poprawnie, ale kod nie mówi, czy to imię, e-mail, telefon albo adres,
- `Ryzykownie`: część pól ma autocomplete, ale wartości są zbyt ogólne albo nie pasują do celu,
- `Dobrze`: pola mają widoczne etykiety oraz poprawne wartości autocomplete, dzięki czemu autouzupełnianie i technologie wspomagające mogą działać lepiej.

To ma być statyczny schemat.
Nie dodawaj JS. Nie dodawaj prawdziwego formularza, jeśli demo nie jest działające. Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby. Nie przekazuj oceny tylko kolorem.

Możliwe klasy CSS:

- `.wcag-input-purpose-demo`
- `.wcag-input-purpose-demo__grid`
- `.wcag-input-purpose-demo__item`
- `.wcag-input-purpose-demo__item--bad`
- `.wcag-input-purpose-demo__item--risky`
- `.wcag-input-purpose-demo__item--good`
- `.wcag-input-purpose-demo__field`
- `.wcag-input-purpose-demo__code-label`
- `.wcag-input-purpose-demo__note`

Style muszą być scoped do `.wcag-input-purpose-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `1.3.1 Informacje i relacje`
- `3.3.2 Etykiety lub instrukcje`
- `3.3.7 Powtarzające się wpisy`
- `3.3.8 Dostępne uwierzytelnianie — minimum`
- `4.1.2 Nazwa, rola, wartość`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 1.3.5.
- [ ] 1.3.5 ma pełną strukturę tutorialową.
- [ ] 1.3.5 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo pokazuje różnicę między etykietą wizualną a programowo określonym celem pola.
- [ ] Demo nie udaje działającego formularza.
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

`Expand WCAG 1.3.5 identify input purpose tutorial`
