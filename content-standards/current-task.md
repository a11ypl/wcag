# Current task: 1.3.3 Właściwości zmysłowe

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote, bo `current-task.md` mógł zostać zaktualizowany na GitHubie.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Znajdź realny plik HTML dla kryterium `1.3.3 Właściwości zmysłowe` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug:

- `public/wcag-prostym-jezykiem/1-3-3-wlasciwosci-zmyslowe.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, utwórz go pod istniejącym adresem wskazywanym przez nawigację z kryterium `1.3.2`.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `1.3.3 Właściwości zmysłowe`
- Poziom: `A`
- Plik HTML: realny plik 1.3.3 w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać tylko:

- stronę kryterium `1.3.3`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Źródła do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `1.3.3 Sensory Characteristics`
- Understanding WCAG 1.3.3
- How to Meet / Quick Reference dla 1.3.3
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.

## Granice kryterium

1.3.3 dotyczy instrukcji, które polegają wyłącznie na cechach zmysłowych, takich jak:

- kolor,
- kształt,
- rozmiar,
- położenie,
- orientacja,
- dźwięk.

Nie mieszaj z:

- `1.4.1 Użycie koloru` - informacja przekazywana tylko kolorem,
- `1.3.1 Informacje i relacje` - struktura i relacje dostępne programowo,
- `1.3.2 Zrozumiała kolejność` - kolejność treści,
- `3.3.2 Etykiety lub instrukcje` - kompletność etykiet i instrukcji formularzy.

Kryterium nie zakazuje używania koloru, położenia, kształtu ani dźwięku. Wymaga, żeby instrukcja miała dodatkową informację tekstową albo programową, która nie zależy wyłącznie od zmysłów.

## Sens prostym językiem

Nie mów użytkownikowi tylko: „kliknij zielony przycisk”, „wybierz opcję po prawej” albo „uzupełnij pole poniżej”. Dodaj nazwę, etykietę albo inny tekstowy punkt odniesienia, żeby osoba, która nie widzi układu, koloru, kształtu albo nie słyszy dźwięku, mogła wykonać zadanie.

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

Uwzględnij przykłady:

- źle: „Kliknij zielony przycisk po prawej”,
- dobrze: „Kliknij przycisk 'Zapisz zmiany'”,
- źle: „Uzupełnij pole poniżej”,
- dobrze: „W sekcji 'Dane kontaktowe' uzupełnij pole 'E-mail'”.

Uwzględnij też instrukcje odnoszące się wyłącznie do:

- koloru: „wybierz czerwone pole”,
- kształtu: „kliknij okrągłą ikonę”,
- rozmiaru: „naciśnij większy przycisk”,
- położenia: „formularz po lewej”,
- orientacji: „element obrócony pionowo”,
- dźwięku: „po sygnale przejdź dalej”.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Dobra instrukcja dla przycisku z nazwą działania - `Kod — HTML`.
2. Zła instrukcja oparta wyłącznie na kolorze i położeniu - `Kod — HTML`.
3. Dobra instrukcja dla formularza, która wskazuje sekcję i etykietę pola - `Kod — HTML`.

Nie twórz pełnej aplikacji ani JavaScriptu. Nie dodawaj ARIA, jeśli wystarczy natywny HTML.

## Demo edukacyjne

Zrób statyczne demo jako porównanie instrukcji:

- `Źle`: instrukcja zależy tylko od koloru, położenia albo dźwięku,
- `Ryzykownie`: instrukcja ma cechę zmysłową i częściowy kontekst, ale nadal nie wskazuje jednoznacznie elementu,
- `Dobrze`: instrukcja podaje nazwę, etykietę albo tekstowy punkt odniesienia.

To ma być statyczny schemat.
Nie dodawaj JS. Nie dodawaj prawdziwego formularza, jeśli demo nie jest działające. Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby. Nie przekazuj oceny tylko kolorem.

Możliwe klasy CSS:

- `.wcag-sensory-demo`
- `.wcag-sensory-demo__grid`
- `.wcag-sensory-demo__item`
- `.wcag-sensory-demo__item--bad`
- `.wcag-sensory-demo__item--risky`
- `.wcag-sensory-demo__item--good`
- `.wcag-sensory-demo__instruction`
- `.wcag-sensory-demo__target`
- `.wcag-sensory-demo__note`

Style muszą być scoped do `.wcag-sensory-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `1.3.1 Informacje i relacje`
- `1.3.2 Zrozumiała kolejność`
- `1.4.1 Użycie koloru`
- `3.3.2 Etykiety lub instrukcje`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] 1.3.3 ma pełną strukturę tutorialową.
- [ ] 1.3.3 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo pokazuje różnicę między instrukcją zależną od zmysłów i instrukcją jednoznaczną tekstowo.
- [ ] Demo nie udaje działającego formularza.
- [ ] Powiązane kryteria są linkami do istniejących stron.
- [ ] Brak martwych linków lokalnych w nowych treściach.
- [ ] Style demo są scoped.
- [ ] Publiczna sekcja `Źródła` zawiera tylko źródła merytoryczne.
- [ ] Techniki i failures nie zostały dopisane bez weryfikacji.
- [ ] Status został zaktualizowany.
- [ ] Source QA został zaktualizowany.

## Commit

Commit message po wykonaniu rozbudowy:

`Expand WCAG 1.3.3 sensory characteristics tutorial`
