# MASTER PROMPT DLA CODEX - A11yFirst Lab

Zbuduj MVP aplikacji webowej **A11yFirst Lab**: dostępnej, interaktywnej gry edukacyjnej do ćwiczenia audytowania dostępności cyfrowej.

## Cel aplikacji

Aplikacja ma umożliwiać uczestnikom kursów Accessibility First ćwiczenie realnych decyzji audytorskich:

- rozpoznanie błędu dostępności,
- wybór właściwego kryterium WCAG,
- wybór najlepszej rekomendacji naprawczej,
- zrozumienie, dlaczego inne odpowiedzi są błędne,
- zapisywanie postępu i powrót do ćwiczeń.

## Stack MVP

Zbuduj jako statyczną aplikację:

- Vite + React + TypeScript,
- bez frameworka UI, chyba że jest naprawdę konieczny,
- CSS natywny lub CSS modules,
- dane ćwiczeń ładowane z pliku JSON,
- zapis postępu w `localStorage`,
- testy: Vitest + Testing Library + axe-core/jest-axe,
- e2e: Playwright, w tym testy klawiatury i podstawowe testy a11y.

Aplikacja ma dać się zbudować jako statyczny katalog `dist/` i wrzucić na podstronę lub podkatalog WordPressa.

## Tryby gry w MVP

W MVP zrób 2 tryby:

1. **WCAG Detective** - użytkownik czyta scenariusz i wybiera najlepszą odpowiedź ABCD.
2. **Prawda/Fałsz Audytora** - użytkownik ocenia zdanie jako prawdziwe lub fałszywe.

Przygotuj architekturę tak, aby później można było dodać:

- ARIA Surgeon,
- Formularzowy Saper,
- Keyboard Escape Room,
- Alt Arena,
- Raportownik.

## Wymagania krytyczne dostępności

Aplikacja musi spełniać WCAG 2.2 AA jako własny standard jakości. Dla polskiego kontekstu prawnego zachowaj zgodność z WCAG 2.1 AA jako minimum ustawowe dla podmiotów publicznych.

Obowiązkowo:

- wszystkie funkcje działają z klawiatury,
- logiczna kolejność fokusu,
- widoczny fokus,
- brak pułapek klawiaturowych,
- semantyczny HTML,
- natywne kontrolki formularzy,
- prawidłowe etykiety,
- komunikaty o wyniku odpowiedzi dostępne dla czytników ekranu,
- brak limitów czasu w MVP,
- poprawne działanie przy powiększeniu do 200% i 400%,
- obsługa `prefers-reduced-motion`,
- brak informacji przekazywanej wyłącznie kolorem,
- kontrast tekstu minimum 4.5:1, elementów nietekstowych i fokusu minimum 3:1,
- targety interaktywne minimum 24x24 CSS px, a preferowane 44x44 CSS px,
- brak customowych komponentów ARIA, jeśli wystarczy natywny HTML.

## Zachowanie po odpowiedzi

Po wyborze odpowiedzi pokaż panel feedbacku.

Panel musi zawierać:

- status: dobrze / nie,
- wybraną odpowiedź,
- wyjaśnienie dla tej konkretnej odpowiedzi,
- poprawną odpowiedź, jeśli użytkownik wybrał źle,
- krótkie uzasadnienie audytorskie,
- kryteria WCAG,
- rekomendację naprawczą, jeśli dotyczy.

Feedback musi być dostępny:

- region z komunikatem ma być ogłaszany przez czytnik ekranu (`aria-live="polite"` albo focus na nagłówku feedbacku),
- nie używaj samego koloru do odróżnienia poprawnej/błędnej odpowiedzi,
- po odpowiedzi użytkownik może przejść do feedbacku klawiaturą bez zgubienia kontekstu.

## Zapis postępu

Zapisuj w `localStorage`:

- ukończone ćwiczenia,
- wybrane odpowiedzi,
- poprawność,
- liczba prób,
- ostatni tryb gry,
- ostatnie pytanie,
- obszary do powtórki,
- data ostatniej aktywności.

Dodaj przyciski:

- „Kontynuuj od ostatniego miejsca”,
- „Powtórz błędne odpowiedzi”,
- „Eksportuj postęp”,
- „Importuj postęp”,
- „Wyczyść postęp”.

Przed wyczyszczeniem postępu pokaż dostępny modal potwierdzenia albo natywny dialog, ale bez pułapki klawiaturowej.

## Struktura ekranów

1. Start / wybór trybu.
2. Ekran ćwiczenia.
3. Panel feedbacku po odpowiedzi.
4. Ekran podsumowania sesji.
5. Ekran postępu.
6. Ekran ustawień dostępności: zmniejszenie animacji, większe odstępy, tryb wysokiego kontrastu, reset danych.

## Dane wejściowe

Użyj pliku `data/a11yfirst_lab_seed_exercises.json` jako źródła przykładowych ćwiczeń. Zaimplementuj walidację struktury danych, najlepiej przez Zod albo własną walidację TypeScript.

## Zakazy

Nie rób:

- divów udających przyciski,
- samych `onClick` bez obsługi klawiatury,
- modalów bez zarządzania fokusem,
- informacji tylko kolorem,
- automatycznego przechodzenia dalej bez decyzji użytkownika,
- losowania, które uniemożliwia powtórkę błędnych odpowiedzi,
- zapisu haseł lub sekretów w localStorage,
- zależności od myszy,
- karuzel, timerów i efektów ruchu w MVP.

## Wynik pracy

Dostarcz:

- działającą aplikację,
- czytelny `README.md`,
- instrukcję deploy na WordPress / statyczny hosting,
- testy jednostkowe i e2e,
- checklistę dostępności przed publikacją,
- przykładowe dane ćwiczeń,
- opis miejsc do dalszej rozbudowy.
