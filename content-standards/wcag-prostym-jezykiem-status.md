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
| 1.4.13 | Treść po najechaniu lub fokusie | proponowane | wymaga ostrożnego przykładu hover/focus bez nowej architektury |
| 2.4.3 | Kolejność fokusu | proponowane | rozwija wzorzec klawiatury i kolejności interakcji |

## Kolejność pracy

1. Przejrzeć pierwszy batch i potwierdzić zakres.
2. Rozbudowywać po jednym kryterium, bez masowej edycji wszystkich podstron.
3. Po każdym kryterium sprawdzać strukturę nagłówków, linki powiązanych kryteriów, przykłady kodu, demo edukacyjne i źródła.
4. Po batchu zdecydować, czy dalsza rozbudowa nadal idzie ręcznie, czy potrzebny jest mały generator treści WCAG.
