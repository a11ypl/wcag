# PRD - A11yFirst Lab

## 1. Nazwa produktu

**A11yFirst Lab**

Roboczy claim:

> Ćwicz audytowanie dostępności cyfrowej na realnych przypadkach.

## 2. Problem

Klasyczne quizy sprawdzają pamięć, ale słabo trenują pracę audytora. Uczestnik kursu musi ćwiczyć rozpoznawanie błędów, mapowanie ich na kryteria WCAG, rozumienie wpływu na użytkowników i formułowanie rekomendacji naprawczych.

## 3. Cel produktu

Stworzyć zamkniętą strefę ćwiczeń na a11yfirst.pl, w której uczestnicy kursów mogą:

- utrwalać wiedzę po zajęciach,
- ćwiczyć decyzje audytorskie,
- otrzymywać wyjaśnienia dla błędnych odpowiedzi,
- wracać do niedokończonych ćwiczeń,
- powtarzać obszary, w których popełniają błędy.

## 4. Grupy użytkowników

### Uczestnik kursu

Potrzebuje prostego narzędzia do powtórki. Nie powinien walczyć z interfejsem. Gra musi działać klawiaturą, czytnikiem ekranu, przy powiększeniu i na urządzeniach mobilnych.

### Trener / administrator treści

Potrzebuje łatwego sposobu dodawania nowych pytań i scenariuszy bez przebudowy aplikacji.

### Audytor zaawansowany

Potrzebuje trudniejszych scenariuszy, w których nie wystarczy znać numer kryterium. Musi uzasadnić decyzję i wybrać najlepszą rekomendację.

## 5. MVP

MVP obejmuje:

- stronę startową,
- wybór trybu gry,
- tryb WCAG Detective,
- tryb Prawda/Fałsz Audytora,
- feedback do każdej odpowiedzi,
- zapis postępu w localStorage,
- powtórkę błędnych odpowiedzi,
- ekran podsumowania,
- tryb ustawień dostępności,
- dane ćwiczeń w JSON.

## 6. Funkcje poza MVP

- logowanie użytkowników,
- zapis postępu po stronie serwera,
- panel administratora,
- edytor ćwiczeń,
- ranking grupy szkoleniowej,
- certyfikat ukończenia,
- Raportownik z oceną jakości wpisu do raportu,
- Keyboard Escape Room z interaktywnymi widokami błędnych komponentów,
- tryb „egzamin końcowy”.

## 7. Zasady edukacyjne

Każde ćwiczenie musi uczyć konkretnego rozróżnienia.

Nie wystarczy komunikat:

> Źle. Poprawna odpowiedź: B.

Wymagany jest feedback:

> Nie. To nie jest problem samego tekstu alternatywnego. Obraz z pustym alt może być poprawny, jeśli jest dekoracyjny. Tutaj jednak obraz jest jedyną treścią przycisku, więc przycisk nie ma dostępnej nazwy.

## 8. Poziomy trudności

- `basic` - rozpoznanie oczywistego błędu.
- `intermediate` - wybór kryterium i konsekwencji dla użytkownika.
- `advanced` - scenariusz z pułapką, kilka pozornie dobrych odpowiedzi.
- `expert` - decyzja audytorska z ograniczeniami implementacyjnymi.

MVP powinien obsługiwać minimum `intermediate` i `advanced`.

## 9. Kategorie treści

- tekst alternatywny,
- struktura i semantyka HTML,
- nagłówki,
- formularze,
- klawiatura,
- fokus,
- kontrast,
- ARIA,
- dostępna nazwa,
- komunikaty dynamiczne,
- multimedia,
- dokumenty,
- deklaracja dostępności,
- język prosty,
- ATAG.

## 10. Definicja sukcesu MVP

MVP jest gotowe, gdy:

- użytkownik może ukończyć sesję tylko klawiaturą,
- feedback jest odczytywany przez czytnik ekranu,
- postęp zapisuje się i odtwarza po odświeżeniu strony,
- użytkownik może powtórzyć błędne odpowiedzi,
- aplikacja przechodzi testy axe bez krytycznych błędów,
- aplikacja działa przy powiększeniu 200% i 400%,
- każdy ekran ma logiczną strukturę nagłówków i landmarków.
