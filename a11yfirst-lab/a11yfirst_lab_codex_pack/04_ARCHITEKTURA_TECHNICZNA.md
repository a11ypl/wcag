# Architektura techniczna - A11yFirst Lab

## 1. Rekomendowany stack MVP

- Vite
- React
- TypeScript
- CSS modules albo zwykły CSS
- JSON jako źródło ćwiczeń
- localStorage jako zapis postępu
- Vitest + Testing Library
- axe-core / jest-axe
- Playwright

## 2. Dlaczego taki stack

- łatwo wygenerować statyczny build,
- łatwo osadzić w WordPressie jako podstronę / katalog,
- React dobrze obsługuje komponenty, ale wymaga dyscypliny semantycznej,
- TypeScript ogranicza błędy w danych ćwiczeń,
- JSON pozwala łatwo dodawać nowe pytania.

## 3. Struktura projektu

```text
src/
  app/
    App.tsx
    routes.ts
  components/
    Layout.tsx
    SkipLink.tsx
    Button.tsx
    FeedbackPanel.tsx
    ProgressSummary.tsx
    ConfirmDialog.tsx
  games/
    WcagDetective.tsx
    TrueFalseGame.tsx
    gameEngine.ts
  data/
    exercises.json
  progress/
    progressStore.ts
    progressTypes.ts
    progressExport.ts
  a11y/
    focusManagement.ts
    announce.ts
  styles/
    global.css
    tokens.css
  types/
    exercise.ts
  tests/
    ...
```

## 4. Routing MVP

Nie musi być pełnego routera. Wystarczy stan aplikacji:

```ts
type View =
  | 'home'
  | 'game'
  | 'summary'
  | 'progress'
  | 'settings';
```

Wariant docelowy może użyć React Router.

## 5. Komponenty bazowe

### Button

Ma renderować natywny `button`. Nie robić przycisku z `div`.

Warianty:

- primary,
- secondary,
- danger,
- text.

Wymagania:

- wyraźny fokus,
- minimum 24x24 CSS px,
- nie polegać wyłącznie na kolorze,
- disabled tylko wtedy, gdy użytkownik rozumie dlaczego.

### FeedbackPanel

Props:

```ts
interface FeedbackPanelProps {
  result: AnswerResult;
  onNext: () => void;
  onRetry?: () => void;
}
```

Zachowanie:

- po pojawieniu się przenosi fokus do nagłówka panelu,
- pokazuje feedback konkretnej odpowiedzi,
- pokazuje poprawną odpowiedź przy błędzie,
- pokazuje kryteria WCAG,
- pokazuje rekomendację naprawczą, jeśli jest dostępna.

### ConfirmDialog

Preferowany natywny `<dialog>` lub dobrze przetestowany komponent.

Użycie:

- reset postępu,
- import postępu nadpisujący obecne dane.

## 6. Dane ćwiczeń

Dane ćwiczeń trzymać poza komponentami. Komponenty mają renderować dane, nie zawierać na sztywno treści pytań.

Źródło:

```text
src/data/exercises.json
```

Docelowo możliwe źródła:

- CMS,
- WordPress REST API,
- plik JSON generowany z bazy treści,
- Supabase / baza danych.

## 7. Deploy na WordPress

### Wariant MVP

1. Zbuduj aplikację:

```bash
npm run build
```

2. Wrzuć zawartość `dist/` do katalogu, np.:

```text
/wp-content/uploads/a11yfirst-lab/
```

3. Utwórz podstronę WordPress:

```text
/lab
```

4. Zabezpiecz ją hasłem w WordPressie albo ustaw Basic Auth / ochronę po stronie serwera.

5. Osadź aplikację przez iframe albo link do katalogu.

Rekomendacja: lepszy jest osobny podkatalog niż iframe, bo iframe komplikuje fokus, tytuły i nawigację. Jeżeli iframe jest konieczny, musi mieć sensowny `title`.

```html
<iframe
  src="/wp-content/uploads/a11yfirst-lab/index.html"
  title="A11yFirst Lab - interaktywna strefa ćwiczeń dostępności cyfrowej">
</iframe>
```

## 8. Hasło i bezpieczeństwo

Nie zapisuj hasła w aplikacji front-endowej.

MVP:

- hasło po stronie WordPress / serwera,
- aplikacja nie zna hasła,
- localStorage przechowuje tylko postęp użytkownika.

Wersja docelowa:

- konta użytkowników,
- sesja po stronie serwera,
- zapis postępu przypisany do konta,
- eksport danych na żądanie użytkownika.

## 9. Dane osobowe

MVP nie powinien zbierać danych osobowych.

Postęp w localStorage jest lokalny dla przeglądarki. Dodaj jasny komunikat:

> Postęp jest zapisywany tylko w tej przeglądarce. Możesz go wyeksportować lub usunąć w ustawieniach.

## 10. Późniejsza architektura z API

Wariant docelowy:

```text
GET /api/progress
PUT /api/progress
POST /api/events
GET /api/exercises
POST /api/admin/exercises
```

Nie implementować w MVP, ale zaprojektować model danych tak, aby migracja była prosta.
