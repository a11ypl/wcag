# A11yFirst Lab

Dostępna, statyczna gra edukacyjna do ćwiczenia audytowania dostępności cyfrowej. MVP obsługuje dwa tryby:

- **Detektyw WCAG**: scenariusz audytorski i jedna odpowiedź ABCD.
- **Prawda/Fałsz Audytora**: ocena krótkiej tezy audytorskiej.

Źródłowy pakiet dokumentów znajduje się w `a11yfirst_lab_codex_pack/`. Aplikacja używa seedów z `a11yfirst_lab_codex_pack/data/a11yfirst_lab_seed_exercises.json`.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Domyślnie Vite pokaże lokalny adres w terminalu, zwykle `http://localhost:5173/`.

## Build

```bash
npm run build
```

Wynik statyczny powstaje w katalogu `dist/`. Konfiguracja `base: './'` pozwala wrzucić build do podkatalogu, np. `/lab/` albo katalogu WordPressa.

Build zaciąga wspólny arkusz Accessibility First z `../public/assets/styles.css` i emituje go jako `dist/assets/styles.css`. Lokalny `src/styles/global.css` jest tylko warstwą komponentów gry i korzysta z tokenów głównego arkusza.

## Testy

```bash
npm run test
npm run test:e2e
npm run typecheck
```

Testy jednostkowe obejmują:

- renderowanie ekranu startowego,
- walidację struktury ćwiczeń,
- wybór odpowiedzi i informację zwrotną,
- zapis postępu,
- kontynuowanie od ostatniego miejsca,
- powtarzanie błędnych odpowiedzi,
- reset postępu,
- przełączniki ustawień dostępności,
- podstawowy test axe.

Testy Playwright obejmują flow klawiaturą oraz modal resetu.

## Wdrożenie na WordPress lub statyczny hosting

1. Uruchom `npm run build`.
2. Skopiuj zawartość katalogu `dist/` do katalogu na hostingu, np. `/wp-content/uploads/a11yfirst-lab/`.
3. Utwórz stronę `/lab` w WordPressie lub link do katalogu statycznego.
4. Zabezpiecz dostęp po stronie WordPressa albo serwera. Aplikacja nie przechowuje haseł ani sekretów.
5. Jeśli używasz iframe, nadaj mu tytuł, np. `title="A11yFirst Lab - interaktywna strefa ćwiczeń dostępności cyfrowej"`.

Lepszym wariantem jest osobny podkatalog zamiast iframe, bo upraszcza fokus, historię strony i tytuł dokumentu.

## Checklista dostępności przed publikacją

- Wszystkie akcje działają klawiaturą.
- Skiplink działa i prowadzi do `main`.
- Pytania są natywnymi grupami radio.
- Informacja zwrotna po odpowiedzi przenosi fokus do panelu i zawiera tekstowy status.
- Modal resetu przenosi fokus do dialogu, trzyma Tab w środku i oddaje fokus po zamknięciu.
- Fokus jest widoczny i ma kontrast minimum 3:1.
- Kontrast tekstu spełnia minimum 4.5:1.
- Aplikacja działa przy 200% i 400% zoom oraz od 320 CSS px szerokości.
- Status poprawnej i błędnej odpowiedzi nie zależy wyłącznie od koloru.
- `prefers-reduced-motion`, tryb wysokiego kontrastu i większe odstępy nie psują układu.
- Testy axe nie pokazują naruszeń critical ani serious.

## Rozbudowa

Kod jest podzielony tak, aby łatwo dodać kolejne tryby:

- `src/types/exercise.ts`: typy ćwiczeń i postępu.
- `src/data/validateExercises.ts`: walidacja danych.
- `src/games/gameEngine.ts`: sprawdzanie odpowiedzi i sesje.
- `src/progress/`: lokalny zapis i reset postępu.
- `src/components/`: komponenty bazowe dostępnego UI.
- `src/app/App.tsx`: stan widoków MVP.

Kolejne tryby z backlogu, np. ARIA Surgeon, Formularzowy Saper, Keyboard Escape Room, Alt Arena i Raportownik, powinny dostać własne typy danych, walidację i komponent ćwiczenia, ale mogą współdzielić `FeedbackPanel`, `progressStore` i `GameSession`.

## Prywatność

MVP zapisuje tylko lokalny postęp w `localStorage` pod kluczem `a11yfirstLabProgress:v1`. Nie zapisuje haseł, tokenów, e-maili ani danych osobowych. Użytkownik może usunąć postęp z ekranu postępu.
