# Current task: 1.3.1 Informacje i relacje

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

Znajdź realny plik HTML dla kryterium `1.3.1 Informacje i relacje` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/1-3-1-informacje-i-relacje.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `1.3.1 Informacje i relacje`
- Poziom: `A`
- Plik HTML: realny plik 1.3.1 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać tylko:

- stronę kryterium `1.3.1`,
- scoped CSS dla demo edukacyjnego,
- status,
- source QA.

Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali, globalnej architektury ani innych kryteriów.

## Źródła do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `1.3.1 Info and Relationships`
- Understanding WCAG 1.3.1
- How to Meet / Quick Reference dla 1.3.1
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.

## Granice kryterium

1.3.1 dotyczy tego, żeby informacje, struktura i relacje widoczne wizualnie były możliwe do odczytania programowo albo dostępne w tekście.

Nie mieszaj z:

- `4.1.2 Nazwa, rola, wartość` — nazwy, role i stany komponentów interfejsu,
- `2.4.6 Nagłówki i etykiety` — opisowość nagłówków i etykiet,
- `1.3.2 Zrozumiała kolejność` — sensowna kolejność odczytu,
- `3.3.2 Etykiety lub instrukcje` — instrukcje dla pól formularzy,
- `1.4.1 Użycie koloru` — informacja przekazana wyłącznie kolorem.

Powiązane kryteria możesz wskazać, ale nie opisuj ich wymagań jako wymagań 1.3.1.

## Sens prostym językiem

Jeśli coś wygląda jak struktura, relacja albo znaczenie, powinno być zapisane w kodzie. Nagłówek ma być nagłówkiem, lista listą, tabela tabelą danych, a etykieta pola prawdziwą etykietą.

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

- tekst wizualnie wygląda jak nagłówek, ale jest zwykłym `div` albo `p`,
- lista wygląda jak lista, ale jest zrobiona z osobnych akapitów albo `br`,
- tabela danych nie ma nagłówków komórek,
- etykieta pola formularza nie jest połączona z polem,
- grupa checkboxów albo radio nie ma wspólnego pytania,
- wymagane pola są oznaczone wizualnie, ale bez informacji programowej lub tekstowej,
- układ kart albo sekcji opiera się na wyglądzie, ale nie ma sensownej struktury w HTML.

Dobre wzorce:

- nagłówki `h1`-`h6` zgodne ze strukturą treści,
- listy `ul`, `ol`, `li`,
- tabele danych z `th`, `scope` i sensownymi nagłówkami,
- pola formularzy z `label for` i `id`,
- grupy pól z `fieldset` i `legend`,
- użycie natywnego HTML przed ARIA,
- tekstowe wyjaśnienie relacji, jeśli relacji nie da się wyrazić w kodzie.

Złe wzorce:

- `div` udający nagłówek tylko przez wielkość i pogrubienie,
- lista zrobiona z punktorów wpisanych jako znaki tekstowe,
- tabela układowa udająca tabelę danych albo tabela danych bez `th`,
- placeholder jako jedyna etykieta pola,
- grupa radio bez `fieldset` i `legend`,
- relacje przekazane tylko położeniem na ekranie.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Dobry nagłówek i lista — `Kod — HTML`.
2. Zły przykład: wizualny nagłówek i lista zrobione z `div`/`br` — `Kod — HTML`.
3. Dobra tabela danych z `th` i `scope` — `Kod — HTML`.
4. Dobre pole formularza z `label` oraz grupa pól z `fieldset` i `legend` — `Kod — HTML`.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Nie dodawaj ARIA, jeśli natywny HTML wystarcza.

## Demo edukacyjne

Zrób statyczne demo jako porównanie wyglądu i semantyki.

Demo ma pokazywać:

- `Źle`: elementy wyglądają jak nagłówek, lista albo tabela, ale w kodzie są tylko neutralnymi kontenerami,
- `Ryzykownie`: część struktury jest semantyczna, ale ważna relacja nadal jest tylko wizualna,
- `Dobrze`: struktura widoczna na ekranie ma odpowiednik w kodzie, np. nagłówek, lista, tabela albo połączona etykieta.

To ma być statyczny schemat.
Nie dodawaj JS. Nie dodawaj prawdziwych formularzy, jeśli demo nie jest działające. Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby. Nie przekazuj oceny tylko kolorem.

Możliwe klasy CSS:

- `.wcag-info-relations-demo`
- `.wcag-info-relations-demo__grid`
- `.wcag-info-relations-demo__item`
- `.wcag-info-relations-demo__item--bad`
- `.wcag-info-relations-demo__item--risky`
- `.wcag-info-relations-demo__item--good`
- `.wcag-info-relations-demo__visual`
- `.wcag-info-relations-demo__code-label`
- `.wcag-info-relations-demo__note`

Style muszą być scoped do `.wcag-info-relations-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `1.3.2 Zrozumiała kolejność`
- `1.3.5 Określenie celu danych wejściowych`
- `2.4.6 Nagłówki i etykiety`
- `3.3.2 Etykiety lub instrukcje`
- `4.1.2 Nazwa, rola, wartość`
- `1.4.1 Użycie koloru`

Jeśli strona powiązanego kryterium nie istnieje, nie linkuj do niej.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 1.3.1.
- [ ] 1.3.1 ma pełną strukturę tutorialową.
- [ ] 1.3.1 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo pokazuje różnicę między wyglądem a semantyką.
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

`Expand WCAG 1.3.1 info and relationships tutorial`
