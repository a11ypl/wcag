# Current task: 3.3.8 Dostępne uwierzytelnianie — minimum

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote, bo `current-task.md` został zaktualizowany na GitHubie.

Uwaga: lokalnie mogą istnieć nieśledzone pliki `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`. Nie commituj ich.

Następnie znajdź realny plik HTML dla kryterium `3.3.8 Dostępne uwierzytelnianie — minimum` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/3-3-8-dostepne-uwierzytelnianie-minimum.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `3.3.8 Dostępne uwierzytelnianie — minimum`
- Poziom: `AA`
- Plik HTML: realny plik 3.3.8 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać:

- stronę kryterium `3.3.8`,
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

- WCAG 2.2: `3.3.8 Accessible Authentication (Minimum)`
- Understanding WCAG 3.3.8
- How to Meet / Quick Reference dla 3.3.8
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.
Jeśli nie możesz potwierdzić techniki/failure, nie wpisuj jej do publicznego tutoriala. Zapisz uwagę w `source-qa`.

## Granice kryterium

3.3.8 dotyczy logowania i uwierzytelniania, które nie powinno wymagać testu funkcji poznawczych, chyba że dostępny jest mechanizm alternatywny albo wspierający.

Nie mieszaj z:

- `3.3.9 Dostępne uwierzytelnianie — rozszerzone` — poziom AAA, odkładamy na później,
- `1.3.5 Określenie celu danych wejściowych` — autocomplete i cel pól danych osobowych,
- `3.3.2 Etykiety lub instrukcje` — instrukcje formularzy,
- `4.1.2 Nazwa, rola, wartość` — nazwy i role komponentów,
- ogólnymi poradami cyberbezpieczeństwa.

Opisuj wymóg dostępnościowy, nie projektuj pełnej polityki bezpieczeństwa.

## Sens kryterium prostym językiem

Logowanie nie powinno zmuszać użytkownika do zapamiętywania, przepisywania, rozwiązywania zagadek albo wykonywania testów poznawczych, jeśli nie ma dostępnej pomocy albo alternatywy.

Kryterium nie zakazuje haseł, kodów ani zabezpieczeń. Chodzi o to, żeby użytkownik mógł skorzystać z pomocy, np. menedżera haseł, wklejania kodu, linku logowania, passkey albo innego mechanizmu, który nie wymaga samodzielnego zapamiętywania i przepisywania.

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

Użytkownik powinien móc zalogować się bez obowiązku samodzielnego zapamiętywania, przepisywania albo rozwiązywania testu poznawczego, jeśli dostępna jest pomoc lub alternatywa.

### Problem w praktyce

Uwzględnij przykłady:

- blokowanie wklejania hasła lub kodu,
- wymuszanie przepisywania znaków z obrazka,
- pytania typu „wybierz wszystkie zdjęcia z sygnalizacją”,
- wymaganie zapamiętania hasła bez wsparcia menedżera haseł,
- zbyt krótkie limity czasu na kod bez sensownego ponowienia,
- logowanie, które nie działa z menedżerami haseł albo passkey.

Problem: użytkownik może znać swoje dane i mieć prawo dostępu, ale nie przejść procesu logowania przez wymaganie pamięci, przepisywania albo rozpoznawania obrazów.

### Dobry przykład

Uwzględnij:

- pola logowania zgodne z menedżerami haseł,
- możliwość wklejenia hasła i kodu jednorazowego,
- link logowania wysłany e-mailem,
- passkey / WebAuthn jako dostępna alternatywa,
- kod jednorazowy możliwy do skopiowania i wklejenia,
- CAPTCHA z dostępną alternatywą, jeśli musi wystąpić.

### Zły przykład

Uwzględnij:

- blokowanie paste w polu hasła albo kodu,
- CAPTCHA wyłącznie obrazkowa,
- przepisywanie trudnych znaków z obrazka,
- pytania wymagające pamięci albo obliczeń bez alternatywy,
- logowanie zależne wyłącznie od rozpoznawania obiektów na zdjęciach,
- proces, który nie pozwala używać menedżera haseł.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i `class="language-html"` albo właściwą klasę języka.

Preferowane przykłady:

1. Pole logowania przyjazne dla menedżera haseł — `Kod — HTML`.
2. Pole kodu jednorazowego z możliwością wklejenia i `autocomplete="one-time-code"` — `Kod — HTML`.
3. Zły przykład: blokowanie wklejania w polu hasła/kodu — `Kod — JavaScript`.
4. Alternatywny sposób logowania, np. link e-mail albo passkey — `Kod — HTML`.

Uwaga:
- Nie projektuj kompletnego systemu logowania.
- Nie dodawaj działającego JS do tutoriala.
- Jeśli pokazujesz zły JS, ma być tylko fragmentem kodu w przykładzie, nie działającą funkcją strony.

## Demo edukacyjne

Zrób statyczne demo jako schemat procesu logowania, nie działający formularz.

Demo ma pokazywać:

- `Źle`: Hasło → przepisz kod z obrazka → brak alternatywy,
- `Ryzykownie`: Kod SMS/e-mail → krótki czas → brak wklejania lub słabe wsparcie,
- `Dobrze`: Menedżer haseł / wklej kod / link logowania / passkey → dostępna alternatywa.

To ma być statyczny schemat procesu.
Nie używaj prawdziwych inputów.
Nie udawaj działającego logowania.
Nie dodawaj JS do demo.
Nie dodawaj ARIA bez potrzeby.

Możliwe klasy CSS:

- `.wcag-auth-demo`
- `.wcag-auth-demo__grid`
- `.wcag-auth-demo__item`
- `.wcag-auth-demo__item--bad`
- `.wcag-auth-demo__item--risky`
- `.wcag-auth-demo__item--good`
- `.wcag-auth-demo__flow`
- `.wcag-auth-demo__step`
- `.wcag-auth-demo__note`

Style muszą być scoped do `.wcag-auth-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `1.3.5 Określenie celu danych wejściowych`
- `3.3.2 Etykiety lub instrukcje`
- `3.3.7 Powtarzające się wpisy`
- `4.1.2 Nazwa, rola, wartość`
- `4.1.3 Komunikaty o stanie`

Nie linkuj do `3.3.9`, jeśli nie istnieje albo jeśli nie chcemy wchodzić teraz w AAA.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 3.3.8.
- [ ] 3.3.8 ma pełną strukturę tutorialową.
- [ ] 3.3.8 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo jest statycznym schematem procesu logowania.
- [ ] Demo nie udaje działającego formularza ani procesu logowania.
- [ ] Zły JavaScript występuje tylko jako przykład kodu, nie jako działanie strony.
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

`Expand WCAG 3.3.8 accessible authentication tutorial`
