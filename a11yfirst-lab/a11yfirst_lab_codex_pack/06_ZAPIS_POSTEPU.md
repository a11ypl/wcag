# Zapis postępu - A11yFirst Lab

## 1. Cel

Użytkownik ma móc wrócić do ćwiczeń po odświeżeniu strony lub zamknięciu przeglądarki.

## 2. Wariant MVP

Zapis w `localStorage`.

Klucz:

```text
a11yfirstLabProgress:v1
```

Nie zapisywać:

- haseł,
- danych osobowych,
- e-maili,
- danych szkoleniowych wrażliwych,
- tokenów dostępu.

## 3. Co zapisujemy

- ukończone ćwiczenia,
- błędne ćwiczenia,
- ostatnie miejsce,
- odpowiedzi użytkownika,
- liczba prób,
- statystyki kategorii,
- ustawienia dostępności,
- czas ostatniej aktywności.

## 4. Przykładowy obiekt

```json
{
  "userProgressVersion": 1,
  "createdAt": "2026-06-27T10:00:00.000Z",
  "updatedAt": "2026-06-27T10:20:00.000Z",
  "lastMode": "wcag-detective",
  "lastExerciseId": "wcag-name-role-001",
  "completedExerciseIds": ["wcag-name-role-001"],
  "incorrectExerciseIds": ["aria-hidden-focus-002"],
  "resultsByExerciseId": {
    "wcag-name-role-001": {
      "attempts": 1,
      "lastSelectedAnswerId": "b",
      "correct": true,
      "lastAnsweredAt": "2026-06-27T10:05:00.000Z"
    }
  },
  "categoryStats": {
    "dostępna nazwa": {
      "answered": 1,
      "correct": 1,
      "incorrect": 0,
      "lastAnsweredAt": "2026-06-27T10:05:00.000Z"
    }
  },
  "settings": {
    "reduceMotion": false,
    "highContrast": false,
    "largeSpacing": false,
    "showWcagHints": true
  }
}
```

## 5. Funkcje progressStore

```ts
getProgress(): UserProgress
saveProgress(progress: UserProgress): void
recordAnswer(result: AnswerResult, exercise: Exercise): UserProgress
resetProgress(): void
exportProgress(): Blob
importProgress(file: File): Promise<UserProgress>
```

## 6. Obsługa błędów localStorage

localStorage może być niedostępny, np. tryb prywatny, blokady przeglądarki, pełny limit.

Aplikacja musi:

- działać bez zapisu postępu,
- pokazać komunikat: „Postęp nie może zostać zapisany w tej przeglądarce”,
- umożliwić ręczny eksport postępu, jeśli dane są w pamięci sesji.

## 7. Import postępu

Import ma:

1. sprawdzić, czy plik jest JSON,
2. sprawdzić `userProgressVersion`,
3. sprawdzić wymagane pola,
4. zapytać użytkownika, czy chce nadpisać obecny postęp,
5. zapisać dane,
6. pokazać dostępny komunikat sukcesu.

## 8. Eksport postępu

Przycisk:

```html
<button type="button">Eksportuj postęp</button>
```

Po eksporcie pokaż komunikat:

> Wyeksportowano postęp do pliku. Możesz go później zaimportować w tej lub innej przeglądarce.

## 9. Reset postępu

Reset wymaga potwierdzenia.

Tekst modala:

> Czy na pewno chcesz usunąć postęp? Tej operacji nie da się cofnąć. Możesz najpierw wyeksportować postęp do pliku.

Przyciski:

- „Anuluj” - fokus domyślny,
- „Usuń postęp” - wariant danger.

## 10. Wariant docelowy z API

W przyszłości można dodać synchronizację:

```http
GET /api/progress
PUT /api/progress
```

Wariant serwerowy powinien rozwiązać problem pracy na kilku urządzeniach. W MVP nie jest konieczny.

## 11. Prywatność

Na ekranie ustawień dodaj informację:

> W wersji MVP postęp jest zapisywany lokalnie w Twojej przeglądarce. Accessibility First nie widzi Twoich wyników, chyba że samodzielnie wyślesz plik eksportu.
