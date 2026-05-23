# Current task: 2.4.11 Fokus niezakryty — minimum

## Polecenie dla Codexa

Wykonaj ten task zgodnie z:

- `content-standards/codex-playbook.md`
- `content-standards/tutorial-checklist.md`
- `content-standards/source-checklist.md`
- `content-standards/wcag-prostym-jezykiem-style-guide.md`

Na końcu zrób bezpieczny commit tylko z plikami z zakresu zadania.

## Zanim zaczniesz

Najpierw wciągnij najnowszy remote, bo `current-task.md` został zaktualizowany na GitHubie.

Nie commituj nieśledzonych plików:

- `.vercel/`
- `Czytniki ekranu/`
- `cms/`
- `ola.jfif`

Następnie znajdź realny plik HTML dla kryterium `2.4.11 Fokus niezakryty — minimum` w `public/wcag-prostym-jezykiem/`.

Oczekiwany slug to prawdopodobnie:

- `public/wcag-prostym-jezykiem/2-4-11-fokus-niezakryty-minimum.html`

Jeśli slug jest inny, użyj realnego pliku. Jeśli pliku nie ma, zatrzymaj się i opisz problem — nie twórz nowej strony bez potwierdzenia.

## Zadanie

Rozbuduj kryterium:

- Numer i tytuł: `2.4.11 Fokus niezakryty — minimum`
- Poziom: `AA`
- Plik HTML: realny plik 2.4.11 znaleziony w `public/wcag-prostym-jezykiem/`
- Możliwy CSS: `public/assets/styles.css` tylko dla scoped demo CSS, jeśli potrzebne
- Status: `content-standards/wcag-prostym-jezykiem-status.md`
- Source QA: `content-standards/wcag-prostym-jezykiem-source-qa.md`

## Zakres

Można zmieniać:

- stronę kryterium `2.4.11`,
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

## Podstawa źródłowa do sprawdzenia

Sprawdź przed pisaniem:

- WCAG 2.2: `2.4.11 Focus Not Obscured (Minimum)`
- Understanding WCAG 2.4.11
- How to Meet / Quick Reference dla 2.4.11
- techniki W3C i failures tylko po weryfikacji w W3C

Nie dopisuj technik ani failures z pamięci.
Jeśli nie możesz potwierdzić techniki/failure, nie wpisuj jej do publicznego tutoriala. Zapisz uwagę w `source-qa`.

## Granice kryterium

2.4.11 dotyczy sytuacji, w której element ma fokus klawiatury, ale zostaje całkowicie zasłonięty przez inny element interfejsu, np. sticky header, baner cookie, pasek dolny, czat, modal albo przyklejony panel.

Nie mieszaj z:

- `2.4.7 Widoczny fokus` — czy w ogóle widać wskaźnik fokusu,
- `2.4.12 Fokus niezakryty — rozszerzony` — poziom AAA, odkładamy na później,
- `2.4.3 Kolejność fokusu` — logiczna kolejność przechodzenia fokusu,
- `1.4.11 Kontrast elementów nietekstowych` — kontrast wskaźnika fokusu,
- `2.4.13 Wygląd fokusu` — parametry wyglądu fokusu.

Pamiętaj: w 2.4.11 minimum problemem jest całkowite zasłonięcie elementu z fokusem przez treść utworzoną przez autora. Częściowe zasłonięcie należy omówić ostrożnie jako ryzyko i powiązanie z wyższym poziomem, nie jako pewne naruszenie 2.4.11.

## Sens kryterium prostym językiem

Jeśli użytkownik przechodzi po stronie klawiaturą, aktualnie aktywny element nie może zniknąć całkowicie pod przyklejonym nagłówkiem, banerem, oknem albo inną warstwą interfejsu.

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

Element z fokusem nie może być całkowicie zasłonięty przez przyklejone lub nachodzące elementy strony.

### Problem w praktyce

Uwzględnij przykłady:

- sticky header zasłania link po przejściu do sekcji,
- pasek cookie zasłania przycisk z fokusem,
- przyklejony chat zasłania dolny przycisk,
- modal albo panel boczny zakrywa element, który nadal dostaje fokus,
- automatyczne przewinięcie ustawia fokus pod nagłówkiem.

### Dobry przykład

Uwzględnij:

- odpowiednie odstępy przy sticky headerze,
- `scroll-margin-top` lub analogiczne rozwiązanie dla kotwic/sekcji,
- testowanie Tabem przy przyklejonych elementach,
- brak fokusu na elementach zakrytych przez modal/panel,
- banery i paski, które nie zasłaniają aktywnego elementu.

### Zły przykład

Uwzględnij:

- fokus całkowicie ukryty pod sticky headerem,
- fokus trafia do elementu pod modalem,
- dolny pasek zasłania aktywny przycisk,
- chat widget zasłania link/przycisk,
- przewinięcie do kotwicy chowa nagłówek albo kontrolkę pod przyklejonym menu.

## Przykłady kodu

Dodaj przykłady w `.wcag-code-example`.
Każdy blok ma mieć etykietę języka i właściwą klasę języka.

Preferowane przykłady:

1. Dobry przykład CSS z `scroll-margin-top` dla sekcji/kotwic — `Kod — CSS`.
2. Dobry wzorzec HTML/CSS: przyklejony header i zachowany odstęp dla treści — `Kod — HTML` lub `Kod — CSS`.
3. Zły przykład CSS: sticky header bez uwzględnienia przewijania do kotwic — `Kod — CSS`.
4. Dobry wzorzec dla modala/panelu: nie zostawiaj fokusu na treści przykrytej warstwą — `Kod — HTML` albo krótki przykład koncepcyjny.

Nie twórz pełnej aplikacji ani ciężkiego JavaScriptu. Jeżeli pokazujesz zachowanie dynamiczne, opisz je jako wzorzec, a nie działającą funkcję strony.

## Demo edukacyjne

Zrób statyczne demo jako schemat zasłonięcia fokusu, nie działający komponent.

Demo ma pokazywać:

- `Źle`: Fokus znajduje się pod przyklejonym nagłówkiem / banerem i nie widać aktywnego elementu,
- `Ryzykownie`: Fokus jest widoczny tylko częściowo albo bardzo blisko zasłaniającej warstwy,
- `Dobrze`: Fokusowany element ma zachowany odstęp i jest widoczny w całości.

To ma być statyczny schemat.
Nie dodawaj JS.
Nie dodawaj prawdziwych kontrolek, jeśli demo nie jest działające.
Nie dodawaj `tabindex`, `role` ani ARIA bez potrzeby.
Nie przekazuj oceny tylko kolorem — użyj tekstowych etykiet i opisów.

Możliwe klasy CSS:

- `.wcag-focus-obscured-demo`
- `.wcag-focus-obscured-demo__grid`
- `.wcag-focus-obscured-demo__item`
- `.wcag-focus-obscured-demo__item--bad`
- `.wcag-focus-obscured-demo__item--risky`
- `.wcag-focus-obscured-demo__item--good`
- `.wcag-focus-obscured-demo__viewport`
- `.wcag-focus-obscured-demo__sticky`
- `.wcag-focus-obscured-demo__focus-target`
- `.wcag-focus-obscured-demo__note`

Style muszą być scoped do `.wcag-focus-obscured-demo`.

## Powiązane kryteria

Dodaj tylko jako linki do istniejących podstron. Sprawdź rzeczywiste slugi.

Rozważ:

- `2.4.3 Kolejność fokusu`
- `2.4.7 Widoczny fokus`
- `2.4.13 Wygląd fokusu`
- `1.4.11 Kontrast elementów nietekstowych`
- `2.4.1 Możliwość pominięcia bloków`

Nie linkuj do `2.4.12`, jeśli nie istnieje albo jeśli nie chcemy wchodzić teraz w AAA.

## Weryfikacja przed zakończeniem

- [ ] Znaleziono realny plik HTML 2.4.11.
- [ ] 2.4.11 ma pełną strukturę tutorialową.
- [ ] 2.4.11 ma jeden `h1`.
- [ ] Przykłady kodu mają etykiety języka.
- [ ] `code` ma klasy `language-*`.
- [ ] Demo jest statycznym schematem zasłonięcia fokusu.
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

`Expand WCAG 2.4.11 focus not obscured tutorial`
