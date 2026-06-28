# Plan testów a11y i QA - A11yFirst Lab

## 1. Cel

Potwierdzić, że A11yFirst Lab jest dostępny, użyteczny i stabilny przed publikacją na a11yfirst.pl.

## 2. Testy automatyczne

### HTML i linting

- brak błędów semantycznych w HTML,
- brak pustych przycisków,
- brak elementów interaktywnych bez nazwy,
- brak pozytywnych `tabindex`.

### axe-core

Uruchomić dla widoków:

- start,
- wybór trybu,
- pytanie ABCD,
- pytanie Prawda/Fałsz,
- feedback poprawny,
- feedback błędny,
- podsumowanie,
- postęp,
- ustawienia,
- modal resetu.

Wynik MVP: brak naruszeń critical/serious.

## 3. Testy klawiatury

Scenariusz:

1. Otwórz aplikację.
2. Użyj Tab do skiplinka.
3. Enter - przejdź do treści głównej.
4. Przejdź do wyboru trybu.
5. Uruchom tryb.
6. Wybierz odpowiedź radiową.
7. Zatwierdź odpowiedź.
8. Sprawdź, czy fokus trafia do feedbacku.
9. Przejdź do następnego pytania.
10. Ukończ sesję.
11. Wejdź w ekran postępu.
12. Eksportuj postęp.
13. Otwórz reset postępu i anuluj.
14. Otwórz reset postępu i potwierdź.

Kryteria zaliczenia:

- nie trzeba używać myszy,
- fokus jest zawsze widoczny,
- nie ma pułapki klawiaturowej,
- kolejność fokusu jest logiczna,
- modal oddaje fokus po zamknięciu.

## 4. Testy czytników ekranu

Minimum:

- NVDA + Firefox albo Chrome na Windows,
- VoiceOver + Safari na macOS.

Sprawdzić:

- tytuł strony,
- nagłówki,
- landmarki,
- grupę odpowiedzi radiowych,
- stan zaznaczonej odpowiedzi,
- komunikat po zatwierdzeniu,
- odczyt feedbacku,
- przyciski eksportu/importu/resetu,
- błędy importu.

## 5. Testy powiększenia i reflow

Sprawdzić:

- zoom 200%,
- zoom 400%,
- szerokość 320 CSS px,
- orientacja pozioma na mobile,
- brak przewijania w dwóch kierunkach dla całej strony,
- brak uciętych przycisków i feedbacku.

## 6. Test forced colors / wysoki kontrast

Windows High Contrast albo emulacja `forced-colors`.

Sprawdzić:

- fokus widoczny,
- przyciski czytelne,
- radio buttons widoczne,
- status poprawne/błędne nie zależy wyłącznie od koloru,
- ikonki nie są jedynym nośnikiem informacji.

## 7. Test prefers-reduced-motion

Włączyć ograniczenie ruchu.

Sprawdzić:

- brak animacji wymuszających uwagę,
- brak automatycznego przewijania, które dezorientuje,
- brak migania.

## 8. Test localStorage

Scenariusze:

- odpowiedz na pytanie, odśwież stronę, sprawdź postęp,
- zamknij kartę, wróć, sprawdź kontynuację,
- wyczyść localStorage, sprawdź pusty stan,
- zablokuj localStorage, sprawdź komunikat,
- eksportuj postęp,
- importuj poprawny plik,
- importuj błędny JSON,
- importuj plik bez wymaganych pól.

## 9. Test treści

Dla każdego ćwiczenia:

- jest dokładnie jedna poprawna odpowiedź w ABCD,
- każda odpowiedź ma feedback,
- feedback wyjaśnia, dlaczego odpowiedź jest dobra lub zła,
- kryteria WCAG są poprawnie przypisane,
- rekomendacja naprawcza jest praktyczna,
- nie ma pułapek terminologicznych bez sensu edukacyjnego.

## 10. Definicja gotowości do publikacji

Aplikacja może wejść na a11yfirst.pl, jeśli:

- wszystkie scenariusze klawiatury przechodzą,
- nie ma krytycznych naruszeń axe,
- postęp zapisuje się poprawnie,
- import/eksport działa,
- feedback jest dostępny,
- aplikacja działa przy 400% zoom,
- min. jeden test czytnikiem ekranu został wykonany ręcznie.
