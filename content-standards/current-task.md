# Current task: 3.3.4 Zapobieganie błędom

## Zadanie

Rozbudować kryterium:

- Numer i tytuł: `3.3.4 Zapobieganie błędom — prawne, finansowe, dane`
- Plik HTML: `public/wcag-prostym-jezykiem/3-3-4-zapobieganie-bledom-prawne-finansowe-dane.html`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne.
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
- globalnej architektury strony.

## Podstawa źródłowa do sprawdzenia

- WCAG 2.2: `3.3.4 Error Prevention (Legal, Financial, Data)`
- Understanding WCAG 3.3.4.
- How to Meet / Quick Reference dla 3.3.4.
- Techniki W3C i failures tylko po weryfikacji.

## Granice kryterium

3.3.4 dotyczy ważnych formularzy i operacji, w których użytkownik:

- podejmuje zobowiązanie prawne,
- wykonuje transakcję finansową,
- zmienia albo usuwa dane,
- wysyła odpowiedzi testowe.

Nie mieszać z:

- `3.3.1 Identyfikacja błędu` - wskazanie błędu po walidacji.
- `3.3.2 Etykiety lub instrukcje` - informacje przed wpisaniem danych.
- `3.3.3 Sugestie korekty błędów` - podpowiedzi naprawy wykrytych błędów.
- `4.1.3 Komunikaty o stanie` - programistyczne ogłaszanie statusu bez przenoszenia fokusu.

## Oczekiwana struktura tutoriala

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

## Weryfikacja przed zakończeniem

- [ ] 3.3.4 ma pełną strukturę tutorialową.
- [ ] 3.3.4 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo nie udaje działającego formularza ani procesu, jeśli jest statyczne.
- [ ] Powiązane kryteria są linkami.
- [ ] Brak martwych linków lokalnych.
- [ ] Style demo są scoped.
- [ ] Linki w treści nadal są fioletowe, pogrubione i podkreślone.
- [ ] Metadane hero są czytelne.
- [ ] Techniki i failures nie zostały dopisane bez weryfikacji.
- [ ] Status został zaktualizowany.
- [ ] Source QA został zaktualizowany.

## Commit

Proponowany commit message po wykonaniu właściwej rozbudowy:

`Expand WCAG 3.3.4 error prevention tutorial`
