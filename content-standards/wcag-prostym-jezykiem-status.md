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
