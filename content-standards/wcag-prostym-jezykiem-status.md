# WCAG prostym językiem: status prac

Ten plik śledzi pierwsze kryteria, które mają posłużyć jako wzorce dla rozbudowy sekcji `WCAG prostym językiem`.

| Kryterium | Tytuł | Status | Cel |
|---|---|---|---|
| 1.1.1 | Treść nietekstowa | wzorzec gotowy do przeglądu | wzorzec dla treści, obrazów i tekstów alternatywnych |
| 2.4.7 | Widoczny fokus | wzorzec gotowy do przeglądu | wzorzec dla klawiatury, CSS i interfejsu |
| 3.3.1 | Identyfikacja błędu | wzorzec gotowy do przeglądu | wzorzec dla formularzy, błędów i komunikatów |

## Baza dla dalszych batchy

Te trzy kryteria tworzą bazę redakcyjną i techniczną dla dalszej rozbudowy:

- `1.1.1 Treść nietekstowa` - wzorzec dla treści, obrazów i tekstów alternatywnych.
- `2.4.7 Widoczny fokus` - wzorzec dla klawiatury, fokusu, CSS i stanów interfejsu.
- `3.3.1 Identyfikacja błędu` - wzorzec dla formularzy, błędów i walidacji.

## Proponowany pierwszy batch po wzorcach

| Kryterium | Dlaczego warto zrobić teraz | Wzorzec bazowy | Przykład kodu | Demo wizualne |
|---|---|---|---|---|
| 1.4.1 Użycie koloru | Łączy się z błędami formularzy, linkami, ikonami i stanami interfejsu. To naturalny następny temat po 3.3.1 i 2.4.7. | 3.3.1 oraz 2.4.7 | Tak, np. komunikat błędu lub legenda wykresu bez polegania wyłącznie na kolorze. | Tak, porównanie „tylko kolor” vs „kolor + tekst/ikona/wzór”. |
| 1.4.3 Kontrast minimum | To jedno z najczęściej sprawdzanych kryteriów i dobry fundament dla tematów wizualnych. | 2.4.7 | Raczej opcjonalnie, np. tokeny CSS kolorów tekstu i tła. | Tak, porównanie tekstu o niskim i poprawnym kontraście. |
| 1.4.11 Kontrast elementów nietekstowych | Wspiera temat fokusu, przycisków, pól formularzy, ikon i wykresów. | 2.4.7 oraz 1.1.1 | Tak, np. CSS dla obramowania pola, ikony lub fokusu. | Tak, kontrolki i ikony z niewystarczającym oraz poprawnym kontrastem. |
| 1.4.13 Treść po najechaniu lub fokusie | Łączy hover, fokus, tooltipy i treści pojawiające się dynamicznie bez potrzeby nowej architektury. | 2.4.7 | Tak, minimalny przykład CSS/HTML dla tooltipu lub podpowiedzi. | Tak, statyczne porównanie podpowiedzi, która znika, i podpowiedzi dostępnej. |
| 2.4.3 Kolejność fokusu | Bezpośrednio rozwija wzorzec klawiatury i fokusu. Pomaga uporządkować przyszłe treści o formularzach, menu i modalach. | 2.4.7 | Tak, przykład kolejności DOM i problematycznego układu wizualnego. | Tak, sekwencja fokusu pokazana jako numerowane kroki. |

## Status pierwszego batcha

| Kryterium | Tytuł | Status | Uwagi |
|---|---|---|---|
| 1.4.1 | Użycie koloru | rozbudowane - gotowe do przeglądu | pierwsze kryterium po trzech wzorcach; korzysta ze wzorców formularzy, fokusu i treści wizualnych |
| 1.4.3 | Kontrast minimum | rozbudowane - gotowe do przeglądu | kolejne kryterium po wzorcach; wzorzec dla kontrastu tekstu i obrazów tekstu |
| 1.4.11 | Kontrast elementów nietekstowych | rozbudowane - gotowe do przeglądu | kolejne kryterium po wzorcach; wzorzec dla ikon, kontrolek, fokusu i informacji graficznych |
| 1.4.13 | Treść po najechaniu lub fokusie | rozbudowane - gotowe do przeglądu | kolejne kryterium po wzorcach; wzorzec dla tooltipów, dymków i treści pojawiających się po hover/focus |
| 2.4.3 | Kolejność fokusu | rozbudowane - gotowe do przeglądu | kolejne kryterium po wzorcach; wzorzec dla kolejności fokusu, DOM, modali i interakcji klawiaturą |

## Kolejność pracy

1. Przejrzeć pierwszy batch i potwierdzić zakres.
2. Rozbudowywać po jednym kryterium, bez masowej edycji wszystkich podstron.
3. Po każdym kryterium sprawdzać strukturę nagłówków, linki powiązanych kryteriów, przykłady kodu, demo edukacyjne i źródła.
4. Po batchu zdecydować, czy dalsza rozbudowa nadal idzie ręcznie, czy potrzebny jest mały generator treści WCAG.

## Rekomendowany kolejny batch

| Kryterium | Dlaczego teraz | Wzorzec bazowy | Kod | Demo wizualne | Ryzyko pomieszania zakresu |
|---|---|---|---|---|---|
| 2.1.1 Klawiatura | Domyka fundament obsługi bez myszy po wzorcach 2.4.7 i 2.4.3. | 2.4.7 Widoczny fokus oraz 2.4.3 Kolejność fokusu | Tak, przykłady natywnych kontrolek i obsługi klawiaturą. | Tak, statyczny przepływ klawiatury przez komponent. | Wysokie: nie mieszać z widocznością fokusu 2.4.7 ani kolejnością fokusu 2.4.3. |
| 2.1.2 Brak pułapki na klawiaturę | Naturalna kontynuacja tematów modalnych, popupów i menu. | 2.4.3 Kolejność fokusu oraz 1.4.13 Treść po najechaniu lub fokusie | Tak, przykład wyjścia z modala lub widgetu. | Tak, demo „wejście, obsługa, wyjście”. | Wysokie: nie mieszać z samą obsługą klawiaturą 2.1.1 ani kolejnością fokusu 2.4.3. |
| 1.3.1 Informacje i relacje | Potrzebne jako baza dla semantyki formularzy, tabel, list i struktur treści. | 1.1.1 Treść nietekstowa oraz 3.3.1 Identyfikacja błędu | Tak, semantyczny HTML, label, fieldset, listy i tabele. | Tak, porównanie struktury wizualnej i semantycznej. | Wysokie: nie mieszać z kolejnością czytania 1.3.2 ani etykietami 3.3.2. |
| 1.3.2 Zrozumiała kolejność | Bezpośrednio łączy się z 2.4.3, ale dotyczy kolejności treści, nie fokusu. | 2.4.3 Kolejność fokusu | Tak, przykład DOM i układu CSS. | Tak, numerowana kolejność czytania. | Wysokie: łatwo pomylić z kolejnością fokusu 2.4.3. |
| 3.3.2 Etykiety lub instrukcje | Rozszerza wzorzec formularzy po 3.3.1 i przygotowuje kolejne tematy walidacji. | 3.3.1 Identyfikacja błędu | Tak, label, instrukcje, aria-describedby tylko gdy potrzebne. | Tak, statyczne demo formularza z etykietą i instrukcją. | Średnie: nie mieszać z identyfikacją błędu 3.3.1 ani sugestiami korekty 3.3.3. |

## Status batcha klawiatura i kolejność

| Kryterium | Tytuł | Status | Uwagi |
|---|---|---|---|
| 2.1.1 | Klawiatura | rozbudowane - gotowe do przeglądu | wzorzec dla ogólnej obsługi funkcji klawiaturą i wyboru natywnych kontrolek HTML |
| 2.1.2 | Brak pułapki na klawiaturę | rozbudowane - gotowe do przeglądu | wzorzec dla wychodzenia z komponentów klawiaturą, Escape i logicznego powrotu fokusu |
| 1.3.2 | Zrozumiała kolejność | rozbudowane - gotowe do przeglądu | wzorzec dla kolejności treści, DOM i relacji między układem wizualnym a kolejnością odczytu |

## Audyt etykiet kodu i źródeł

Mini-checkpoint po poprawkach `2.1.1`:

- Komplet etykiet języka kodu mają teraz strony: `1.1.1`, `1.3.2`, `1.4.1`, `1.4.3`, `1.4.11`, `1.4.13`, `2.1.1`, `2.1.2`, `2.4.3`, `2.4.7`, `3.3.1`.
- `1.3.1 Informacje i relacje` nie ma jeszcze bloków `.wcag-code-example`; wymaga osobnej rozbudowy i audytu źródeł.
- Dalszego audytu źródeł W3C wymagają wszystkie rozbudowane strony w zakresie technik i failures. Technik W3C nie wolno dopisywać bez potwierdzenia w How to Meet / Quick Reference.
- Szczegółowy raport znajduje się w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Checkpoint 2026-05-19: 1.1.1, 2.1.1 i rozbudowa 3.3.2

- `1.1.1 Treść nietekstowa`: OK. Główne przykłady `img` + `alt` używają prostych formatów JPG/PNG. SVG jest opisany osobno w sekcji „A co z SVG?” i nie sugeruje, że plik SVG sam ma `alt`.
- `2.1.1 Klawiatura`: OK. Zły przykład kodu pokazuje `div` z `onclick`, a zły przykład w demo jest statyczną makietą bez `onclick`, `tabindex`, `role`, ARIA, focus styles i `cursor: pointer`. Dobry przykład używa natywnego `button`, a link wygląda jak link.
- `3.3.2 Etykiety lub instrukcje`: rozbudowane do pełnego tutoriala zgodnego ze standardem „WCAG prostym językiem”.
- Dodano statyczne demo `wcag-labels-demo` bez prawdziwych pól formularza.
- Bloki kodu w sprawdzanych stronach mają etykiety języka i klasy `language-html`.
- Powiązane kryteria w `3.3.2` linkują do istniejących podstron.
- Techniki i failure dla `3.3.2` dopisano po weryfikacji w oficjalnych źródłach W3C: WCAG 2.2, Understanding WCAG 3.3.2 i How to Meet WCAG 3.3.2.
- Zweryfikowane techniki/failure: H44, H71, G89, G184, ARIA1, H90, F82.

## Status 2026-05-19: 3.3.3 Sugestie korekty błędów

- `3.3.3 Sugestie korekty błędów`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Kiedy sugestia nie jest możliwa albo niebezpieczna, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-error-suggestion-demo` bez JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` i ARIA.
- Techniki W3C dla `3.3.3` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 3.3.3.
- Zweryfikowane techniki: ARIA18, G85, G177, PDF22, G84. Quick Reference dla `3.3.3` nie wskazuje osobnej listy failures.
- Raport źródeł dla `3.3.3` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-20: 3.3.4 Zapobieganie błędom (prawne, finansowe, dane)

- `3.3.4 Zapobieganie błędom (prawne, finansowe, dane)`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Jeden z trzech mechanizmów, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-error-prevention-demo` bez JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` i ARIA.
- Techniki W3C dla `3.3.4` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 3.3.4.
- Zweryfikowane techniki: G164, G98, G155, G99, G168. Quick Reference dla `3.3.4` nie wskazuje osobnej listy failures.
- Raport źródeł dla `3.3.4` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-22: 3.3.6 Zapobieganie błędom (wszystkie)

- `3.3.6 Zapobieganie błędom (wszystkie)`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-error-prevention-all-demo` jako schemat procesu, bez JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` i ARIA.
- Techniki W3C dla `3.3.6` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 3.3.6.
- Zweryfikowano, że How to Meet dla `3.3.6` odsyła do technik wystarczających dla `3.3.4`, stosowanych do wszystkich formularzy wymagających wysłania informacji.
- Zweryfikowane techniki: G164, G98, G155, G99, G168. Quick Reference dla `3.3.6` nie wskazuje osobnej listy failures.
- Raport źródeł dla `3.3.6` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-22: 3.3.7 Powtarzające się wpisy

- `3.3.7 Powtarzające się wpisy`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-redundant-entry-demo` jako schemat procesu, bez JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` i ARIA.
- Techniki W3C dla `3.3.7` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 3.3.7.
- Zweryfikowana technika: G221. Potencjalnej przyszłej techniki z Quick Reference nie dodano do publicznych źródeł jako techniki.
- Quick Reference dla `3.3.7` nie wskazuje osobnej listy failures.
- Raport źródeł dla `3.3.7` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-23: 3.3.8 Dostępne uwierzytelnianie (minimum)

- `3.3.8 Dostępne uwierzytelnianie (minimum)`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-auth-demo` jako schemat procesu logowania, bez JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` i zbędnego ARIA.
- Techniki i failure W3C dla `3.3.8` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 3.3.8.
- Zweryfikowane techniki: G218, H100. Zweryfikowany failure: F109.
- Potencjalnych przyszłych technik z Quick Reference, takich jak WebAuthn, OAuth i łączenie technik dla 2FA, nie dodano do publicznych źródeł jako zweryfikowanych technik.
- Raport źródeł dla `3.3.8` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-23: 2.4.11 Fokus niezakryty (minimum)

- `2.4.11 Fokus niezakryty (minimum)`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-focus-obscured-demo` jako schemat zasłonięcia fokusu, bez JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` i ARIA.
- Technika i failure W3C dla `2.4.11` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 2.4.11.
- Zweryfikowana technika: C43. Zweryfikowany failure: F110.
- W treści zachowano granicę: 2.4.11 dotyczy całkowitego zasłonięcia elementu z fokusem; częściowe zasłonięcie opisano jako ryzyko i powiązanie z wyższymi wymaganiami.
- Raport źródeł dla `2.4.11` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-23: 2.5.7 Ruch przeciągania

- `2.5.7 Ruch przeciągania`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-dragging-demo` jako schemat funkcji wymagającej przeciągania i alternatywnej drogi bez drag and drop, bez JavaScriptu, `tabindex`, `role` i ARIA.
- Technikę i failure W3C dla `2.5.7` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 2.5.7.
- Zweryfikowana technika: G219. Zweryfikowany failure: F108.
- W treści zachowano granicę: 2.5.7 nie zakazuje przeciągania, tylko wymaga alternatywy dla tej samej funkcji bez ruchu przeciągania.
- Raport źródeł dla `2.5.7` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-23: 2.5.8 Rozmiar celu (minimum)

- `2.5.8 Rozmiar celu (minimum)`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-target-size-demo` jako porównanie małych/cieśnych celów i poprawionych celów, bez JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` i ARIA.
- Technikę W3C dla `2.5.8` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 2.5.8.
- Zweryfikowana technika: C42. Quick Reference dla `2.5.8` nie wskazuje osobnej listy failures.
- W treści zachowano granicę: 2.5.8 dotyczy minimalnego rozmiaru celu albo wystarczającego odstępu, a nie wymaga, żeby każdy widoczny symbol miał fizycznie 24 na 24 px.
- Raport źródeł dla `2.5.8` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-23: 1.3.1 Informacje i relacje

- `1.3.1 Informacje i relacje`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-info-relations-demo` jako porównanie „wygląda jak struktura” i „jest strukturą w kodzie”, bez JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` i ARIA.
- Techniki i failure W3C dla `1.3.1` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 1.3.1.
- Zweryfikowane techniki: H42, H48, H51, H63, H44, H71. Zweryfikowany failure: F91.
- W treści zachowano granicę: 1.3.1 dotyczy informacji, struktury i relacji widocznych wizualnie, które muszą być dostępne programowo albo tekstowo; nie rozwija wymagań 4.1.2 dotyczących nazwy, roli i wartości komponentów.
- Raport źródeł dla `1.3.1` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-23: 1.3.5 Określenie celu danych wejściowych

- `1.3.5 Określenie celu danych wejściowych`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano statyczne demo `wcag-input-purpose-demo` jako porównanie samej etykiety wizualnej z programowo określonym celem pola, bez JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` i ARIA.
- Technikę i failure W3C dla `1.3.5` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 1.3.5.
- Zweryfikowana technika: H98. Zweryfikowany failure: F107.
- W treści zachowano granicę: 1.3.5 dotyczy określonych danych o użytkowniku, których cel można programowo określić, zwykle przez poprawne wartości `autocomplete`; nie wymaga `autocomplete` dla każdego pola formularza.
- Raport źródeł dla `1.3.5` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-28: 1.3.3 Właściwości zmysłowe

- `1.3.3 Właściwości zmysłowe`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nową stronę `public/wcag-prostym-jezykiem/1-3-3-wlasciwosci-zmyslowe.html`, zgodną ze slugiem wskazywanym przez nawigację z `1.3.2`.
- Dodano statyczne demo `wcag-sensory-demo` jako porównanie instrukcji zależnej od cech zmysłowych, instrukcji ryzykownej i instrukcji wskazującej nazwę albo etykietę elementu. Demo nie ma JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` ani ARIA.
- Technikę i failures W3C dla `1.3.3` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 1.3.3.
- Zweryfikowana technika: G96. Zweryfikowane failures: F14, F26.
- W treści zachowano granicę: 1.3.3 dotyczy instrukcji opartych wyłącznie na kolorze, kształcie, rozmiarze, położeniu, orientacji albo dźwięku; nie zastępuje 1.4.1, 1.3.1, 1.3.2 ani 3.3.2.
- Raport źródeł dla `1.3.3` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-28: 1.4.4 Zmiana rozmiaru tekstu

- `1.4.4 Zmiana rozmiaru tekstu`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nową stronę `public/wcag-prostym-jezykiem/1-4-4-zmiana-rozmiaru-tekstu.html`, zgodną ze slugiem wskazywanym przez nawigację z `1.4.3`.
- Dodano statyczne demo `wcag-resize-text-demo` jako porównanie przyciętego tekstu, ryzykownego sztywnego układu i poprawnego układu, który rośnie oraz zawija treść. Demo nie ma JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla `1.4.4` dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG 1.4.4.
- Zweryfikowane techniki: G142, C28, G179. Zweryfikowane failures: F69, F80, F94.
- W treści zachowano granicę: 1.4.4 dotyczy powiększenia tekstu do 200% bez utraty treści lub funkcjonalności; nie zastępuje 1.4.10, 1.4.12, 1.4.3 ani 2.4.7.
- Raport źródeł dla `1.4.4` zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-28: batch 1.4.5, 1.4.10, 1.4.12

- `1.4.5 Obrazy tekstu`: rozbudowane - gotowe do przeglądu.
- `1.4.10 Dopasowanie do ekranu`: rozbudowane - gotowe do przeglądu.
- `1.4.12 Odstępy w tekście`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/1-4-5-obrazy-tekstu.html`, `public/wcag-prostym-jezykiem/1-4-10-dopasowanie-do-ekranu.html`, `public/wcag-prostym-jezykiem/1-4-12-odstepy-w-tekscie.html`.
- Dodano statyczne demo `wcag-images-text-demo`, `wcag-reflow-demo` i `wcag-text-spacing-demo`. Dema nie mają JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 1.4.5 nie zastępuje 1.1.1, 1.4.10 nie jest ogólną oceną RWD, a 1.4.12 nie zastępuje 1.4.4.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-28: batch 2.4.1, 2.4.2, 2.4.4

- `2.4.1 Możliwość pominięcia bloków`: rozbudowane - gotowe do przeglądu.
- `2.4.2 Tytuł strony`: rozbudowane - gotowe do przeglądu.
- `2.4.4 Cel linku w kontekście`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/2-4-1-mozliwosc-pominiecia-blokow.html`, `public/wcag-prostym-jezykiem/2-4-2-tytul-strony.html`, `public/wcag-prostym-jezykiem/2-4-4-cel-linku-w-kontekscie.html`.
- Dodano statyczne demo `wcag-bypass-demo`, `wcag-page-title-demo` i `wcag-link-purpose-demo`. Dema nie mają JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 2.4.1 nie zastępuje ogólnej struktury nagłówków, 2.4.2 nie zastępuje `h1`, a 2.4.4 nie dotyczy wyglądu linków ani kontrastu.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-28: batch 2.4.5, 2.4.6, 3.1.1, 3.1.2

- `2.4.5 Wiele sposobów`: rozbudowane - gotowe do przeglądu.
- `2.4.6 Nagłówki i etykiety`: rozbudowane - gotowe do przeglądu.
- `3.1.1 Język strony`: rozbudowane - gotowe do przeglądu.
- `3.1.2 Język części`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/2-4-5-wiele-sposobow.html`, `public/wcag-prostym-jezykiem/2-4-6-naglowki-i-etykiety.html`, `public/wcag-prostym-jezykiem/3-1-1-jezyk-strony.html`, `public/wcag-prostym-jezykiem/3-1-2-jezyk-czesci.html`.
- Dodano statyczne demo `wcag-multiple-ways-demo`, `wcag-headings-labels-demo`, `wcag-language-page-demo` i `wcag-language-parts-demo`. Dema nie mają JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 2.4.5 nie opisuje samej kolejności menu, 2.4.6 nie zastępuje hierarchii nagłówków z 1.3.1, 3.1.1 nie ocenia jakości tłumaczenia, a 3.1.2 nie wymaga oznaczania pojedynczych nazw własnych.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-29: batch 3.2.1, 3.2.2, 3.2.3, 3.2.4

- `3.2.1 Po otrzymaniu fokusu`: rozbudowane - gotowe do przeglądu.
- `3.2.2 Podczas wprowadzania danych`: rozbudowane - gotowe do przeglądu.
- `3.2.3 Spójna nawigacja`: rozbudowane - gotowe do przeglądu.
- `3.2.4 Spójna identyfikacja`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/3-2-1-po-otrzymaniu-fokusu.html`, `public/wcag-prostym-jezykiem/3-2-2-podczas-wprowadzania-danych.html`, `public/wcag-prostym-jezykiem/3-2-3-spojna-nawigacja.html`, `public/wcag-prostym-jezykiem/3-2-4-spojna-identyfikacja.html`.
- Dodano statyczne demo `wcag-on-focus-demo`, `wcag-on-input-demo`, `wcag-consistent-nav-demo` i `wcag-consistent-id-demo`. Dema nie mają własnego JavaScriptu, prawdziwych pól formularza, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 3.2.1 nie opisuje samej widoczności fokusu, 3.2.2 nie zastępuje walidacji formularza, 3.2.3 nie jest ogólną oceną jakości menu, a 3.2.4 nie wymaga identycznego wyglądu graficznego każdego elementu.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-29: batch multimedia 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5

- `1.2.1 Tylko audio oraz tylko wideo`: rozbudowane - gotowe do przeglądu.
- `1.2.2 Napisy rozszerzone`: rozbudowane - gotowe do przeglądu.
- `1.2.3 Audiodeskrypcja lub alternatywa dla mediów`: rozbudowane - gotowe do przeglądu.
- `1.2.4 Napisy rozszerzone na żywo`: rozbudowane - gotowe do przeglądu.
- `1.2.5 Audiodeskrypcja`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/1-2-1-tylko-audio-oraz-tylko-wideo.html`, `public/wcag-prostym-jezykiem/1-2-2-napisy-rozszerzone.html`, `public/wcag-prostym-jezykiem/1-2-3-audiodeskrypcja-lub-alternatywa-dla-mediow.html`, `public/wcag-prostym-jezykiem/1-2-4-napisy-rozszerzone-na-zywo.html`, `public/wcag-prostym-jezykiem/1-2-5-audiodeskrypcja.html`.
- Dodano statyczne demo `wcag-media-only-demo`, `wcag-captions-demo`, `wcag-media-alt-demo`, `wcag-live-captions-demo` i `wcag-audio-description-demo`. Dema nie mają własnego JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: napisy nie są transkrypcją, transkrypcja nie jest audiodeskrypcją, alternatywa dla mediów ma przekazywać sens całego nagrania, a kryteria dla nagrań i transmisji na żywo mają różne wymagania.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-29: batch interakcje 2.1.4, 2.5.1, 2.5.2, 2.5.3, 2.5.4

- `2.1.4 Skróty klawiszowe znakowe`: rozbudowane - gotowe do przeglądu.
- `2.5.1 Gesty wskaźnika`: rozbudowane - gotowe do przeglądu.
- `2.5.2 Anulowanie wskazania`: rozbudowane - gotowe do przeglądu.
- `2.5.3 Etykieta w nazwie`: rozbudowane - gotowe do przeglądu.
- `2.5.4 Aktywowanie ruchem`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/2-1-4-skroty-klawiszowe-znakowe.html`, `public/wcag-prostym-jezykiem/2-5-1-gesty-wskaznika.html`, `public/wcag-prostym-jezykiem/2-5-2-anulowanie-wskazania.html`, `public/wcag-prostym-jezykiem/2-5-3-etykieta-w-nazwie.html`, `public/wcag-prostym-jezykiem/2-5-4-aktywowanie-ruchem.html`.
- Dodano statyczne demo `wcag-character-shortcuts-demo`, `wcag-pointer-gestures-demo`, `wcag-pointer-cancel-demo`, `wcag-label-name-demo` i `wcag-motion-actuation-demo`. Dema nie mają własnego JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 2.1.4 nie jest ogólną obsługą klawiaturą, 2.5.1 nie zastępuje 2.5.7, 2.5.2 nie dotyczy potwierdzeń błędów formularzy, 2.5.3 nie ocenia samej widoczności tekstu, a 2.5.4 nie dotyczy animacji na stronie.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-29: batch 2.2.1, 2.2.2, 2.3.1

- `2.2.1 Możliwość dostosowania czasu`: rozbudowane - gotowe do przeglądu.
- `2.2.2 Pauza, zatrzymanie, ukrycie`: rozbudowane - gotowe do przeglądu.
- `2.3.1 Trzy błyski lub wartości poniżej progu`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/2-2-1-mozliwosc-dostosowania-czasu.html`, `public/wcag-prostym-jezykiem/2-2-2-pauza-zatrzymanie-ukrycie.html`, `public/wcag-prostym-jezykiem/2-3-1-trzy-blyski-lub-wartosci-ponizej-progu.html`.
- Dodano statyczne demo `wcag-timing-adjustable-demo`, `wcag-pause-stop-hide-demo` i `wcag-flashing-demo`. Dema nie mają własnego JavaScriptu, prawdziwych kontrolek, `tabindex`, `role` ani ARIA.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 2.2.1 dotyczy limitów czasu, 2.2.2 dotyczy ruchu, migania, przewijania i autoaktualizacji, a 2.3.1 dotyczy błysków mogących wywołać napad padaczkowy.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.

## Status 2026-05-29: batch 4.1.1, 4.1.2, 4.1.3

- `4.1.1 Parsowanie`: rozbudowane - gotowe do przeglądu, z jasnym oznaczeniem, że kryterium jest usunięte w WCAG 2.2.
- `4.1.2 Nazwa, rola, wartość`: rozbudowane - gotowe do przeglądu.
- `4.1.3 Komunikaty o stanie`: rozbudowane - gotowe do przeglądu.
- Dodano pełną strukturę tutorialową dla każdego kryterium: Krótko, Problem w praktyce, Kogo to dotyczy, Dobry przykład, Zły przykład, Przykłady kodu, Przykład graficzny, Jak sprawdzić, Co sprawdzi automat, Typowe błędy, Powiązane kryteria i Źródła.
- Dodano nowe strony: `public/wcag-prostym-jezykiem/4-1-1-parsowanie.html`, `public/wcag-prostym-jezykiem/4-1-2-nazwa-rola-wartosc.html`, `public/wcag-prostym-jezykiem/4-1-3-komunikaty-o-stanie.html`.
- Dodano statyczne demo `wcag-parsing-demo`, `wcag-name-role-value-demo` i `wcag-status-messages-demo`. Dema nie mają własnego JavaScriptu, prawdziwych kontrolek, `tabindex` ani ARIA w renderowanym HTML.
- Techniki i failures W3C dla batcha dopisano po weryfikacji w How to Meet / Quick Reference oraz Understanding WCAG.
- W treści zachowano granice: 4.1.1 nie jest ogólną oceną jakości HTML, 4.1.2 nie dotyczy samego tekstu widocznego na ekranie, a 4.1.3 nie zastępuje komunikatów błędów formularza z 3.3.1.
- Raport źródeł dla batcha zapisano w `content-standards/wcag-prostym-jezykiem-source-qa.md`.
