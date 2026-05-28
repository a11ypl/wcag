# Current task: 1.4.4 Zmiana rozmiaru tekstu

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote.

Nie commituj nieśledzonych plików: `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif`.

Nie ruszaj stashu `Preserve unrelated content standards changes before WCAG work`.

Znajdź realny plik HTML dla kryterium `1.4.4 Zmiana rozmiaru tekstu` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug:

- `public/wcag-prostym-jezykiem/1-4-4-zmiana-rozmiaru-tekstu.html`

Jeśli pliku nie ma, utwórz go pod istniejącym adresem wskazywanym przez nawigację z kryterium `1.4.3`.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `1.4.4 Zmiana rozmiaru tekstu`
- Poziom: `AA`
- Plik HTML: realny plik 1.4.4 w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać tylko:

- stronę kryterium `1.4.4`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA,
- ten plik current task.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Źródła do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `1.4.4 Resize Text`
- Understanding WCAG 1.4.4
- How to Meet / Quick Reference dla 1.4.4
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.

## Granice kryterium

1.4.4 dotyczy możliwości powiększenia tekstu do 200% bez utraty treści lub funkcjonalności. Wyjątki w kryterium obejmują napisy i obrazy tekstu.

Nie mieszaj z:

- `1.4.10 Dopasowanie do ekranu` - układ bez przewijania w dwóch kierunkach przy 320 CSS px albo 400%,
- `1.4.12 Odstępy w tekście` - zmiana odstępów między literami, słowami, liniami i akapitami,
- `1.4.3 Kontrast minimum` - czytelność koloru tekstu względem tła,
- `2.4.7 Widoczny fokus` - widoczność wskaźnika fokusu.

## Sens prostym językiem

Użytkownik powinien móc powiększyć tekst do 200% i nadal korzystać ze strony. Tekst nie może znikać, nachodzić na inne elementy, być ucinany ani blokować przycisków, formularzy, menu lub innych funkcji.

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

- źle: tekst po powiększeniu nachodzi na inne elementy,
- źle: przyciski albo menu znikają po powiększeniu tekstu,
- dobrze: układ się rozszerza, zawija albo dostosowuje,
- dobrze: tekst jest w jednostkach względnych, a kontenery nie mają sztywnej wysokości.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Zły przykład sztywnej wysokości i uciętego tekstu - `Kod — CSS`.
2. Dobry przykład kontenera, który rośnie wraz z tekstem - `Kod — CSS`.
3. Dobry przykład menu, które zawija się po powiększeniu tekstu - `Kod — CSS`.
4. Ryzykowny przykład rozmiaru tekstu zależnego wyłącznie od viewportu - `Kod — CSS`.

Nie twórz pełnej aplikacji ani JavaScriptu. Nie dodawaj ARIA, jeśli wystarczy natywny HTML.

## Demo edukacyjne

Zrób statyczne demo jako porównanie:

- `Źle`: tekst jest przycięty albo nachodzi na inny element,
- `Ryzykownie`: menu lub przycisk ma sztywne wymiary i może zgubić treść,
- `Dobrze`: układ zawija się, kontener rośnie i funkcja pozostaje dostępna.

To ma być statyczny schemat.
Nie dodawaj JS. Nie dodawaj prawdziwych kontrolek, jeśli demo nie jest działające. Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby. Nie przekazuj oceny tylko kolorem.

Możliwe klasy CSS:

- `.wcag-resize-text-demo`
- `.wcag-resize-text-demo__grid`
- `.wcag-resize-text-demo__item`
- `.wcag-resize-text-demo__item--bad`
- `.wcag-resize-text-demo__item--risky`
- `.wcag-resize-text-demo__item--good`
- `.wcag-resize-text-demo__mock`
- `.wcag-resize-text-demo__line`
- `.wcag-resize-text-demo__button`
- `.wcag-resize-text-demo__note`

Style muszą być scoped do `.wcag-resize-text-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `1.4.3 Kontrast minimum`
- `1.4.11 Kontrast elementów nietekstowych`
- `1.4.13 Treść po najechaniu lub fokusie`

Nie linkuj do kryteriów, których strona nie istnieje.

## Weryfikacja przed zakończeniem

- [ ] 1.4.4 ma pełną strukturę tutorialową.
- [ ] 1.4.4 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo pokazuje utratę treści/funkcji i poprawkę bez zależności tylko od koloru.
- [ ] Demo nie udaje działającego formularza ani menu.
- [ ] Powiązane kryteria są linkami do istniejących stron.
- [ ] Brak martwych linków lokalnych w nowych treściach.
- [ ] Style demo są scoped.
- [ ] Publiczna sekcja `Źródła` zawiera tylko źródła merytoryczne.
- [ ] Techniki i failures nie zostały dopisane bez weryfikacji.
- [ ] Status został zaktualizowany.
- [ ] Source QA został zaktualizowany.

## Commit

Commit message po wykonaniu rozbudowy:

`Expand WCAG 1.4.4 resize text tutorial`
