# Kryteria akceptacji MVP - A11yFirst Lab

## 1. Funkcjonalność

MVP jest zaakceptowane, jeśli:

- użytkownik może uruchomić aplikację,
- użytkownik może wybrać tryb gry,
- użytkownik może odpowiedzieć na pytanie ABCD,
- użytkownik może odpowiedzieć na pytanie Prawda/Fałsz,
- system pokazuje feedback dla wybranej odpowiedzi,
- system zapisuje wynik,
- system pokazuje podsumowanie sesji,
- użytkownik może kontynuować od ostatniego miejsca,
- użytkownik może powtórzyć błędne odpowiedzi,
- użytkownik może wyeksportować postęp,
- użytkownik może zaimportować postęp,
- użytkownik może usunąć postęp.

## 2. Treść edukacyjna

Każde ćwiczenie musi mieć:

- unikalne ID,
- kategorię,
- poziom trudności,
- poprawną odpowiedź,
- feedback dla każdej odpowiedzi,
- krótkie podsumowanie,
- przypisanie do kryteriów WCAG, jeśli dotyczy.

## 3. Dostępność

MVP jest zaakceptowane, jeśli:

- wszystkie funkcje działają z klawiatury,
- fokus jest widoczny,
- nie ma pułapki klawiaturowej,
- feedback jest dostępny dla czytnika ekranu,
- pytania ABCD są zbudowane jako natywne radio buttony,
- przyciski są natywnymi `button`,
- struktura nagłówków jest logiczna,
- jest skiplink,
- aplikacja działa przy 200% i 400% zoom,
- aplikacja nie wymaga limitu czasu,
- treści nie są przekazywane wyłącznie kolorem,
- kontrast spełnia AA,
- aplikacja przechodzi test axe bez błędów critical/serious.

## 4. Postęp

MVP jest zaakceptowane, jeśli:

- odpowiedź zapisuje się w localStorage,
- odświeżenie strony nie usuwa postępu,
- reset usuwa postęp po potwierdzeniu,
- import waliduje strukturę pliku,
- eksport generuje poprawny plik JSON,
- aplikacja pokazuje komunikat, gdy localStorage jest niedostępny.

## 5. Techniczne

MVP jest zaakceptowane, jeśli:

- `npm run build` kończy się sukcesem,
- `npm run test` kończy się sukcesem,
- `npm run test:e2e` kończy się sukcesem,
- README zawiera instrukcję uruchomienia i deployu,
- dane ćwiczeń są poza komponentami,
- kod nie zawiera sekretów ani haseł.
