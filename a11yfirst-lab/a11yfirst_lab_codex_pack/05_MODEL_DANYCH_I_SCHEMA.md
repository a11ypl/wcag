# Model danych i schema - A11yFirst Lab

## 1. Typy ćwiczeń

MVP obsługuje:

- `single-choice` - ABCD, jedna poprawna odpowiedź,
- `true-false` - Prawda/Fałsz.

Docelowo:

- `multi-step-audit`,
- `code-review`,
- `alt-selection`,
- `report-writing`,
- `keyboard-scenario`.

## 2. Model ćwiczenia ABCD

```json
{
  "id": "wcag-name-role-001",
  "type": "single-choice",
  "mode": "wcag-detective",
  "level": "advanced",
  "category": "dostępna nazwa",
  "question": "Na stronie znajduje się przycisk graficzny...",
  "answers": [
    {
      "id": "a",
      "text": "Poprawne, bo obraz dekoracyjny ma pusty alt",
      "correct": false,
      "feedback": "Nie. Pusty alt może być poprawny..."
    }
  ],
  "wcag": ["4.1.2", "1.1.1"],
  "summary": "Problemem jest brak dostępnej nazwy przycisku.",
  "fix": "<button type=\"submit\" aria-label=\"Szukaj\">...</button>",
  "tags": ["button", "alt", "accessible-name"],
  "estimatedTimeSeconds": 90
}
```

## 3. Model Prawda/Fałsz

```json
{
  "id": "aria-hidden-focus-001",
  "type": "true-false",
  "mode": "true-false-auditor",
  "level": "advanced",
  "category": "ARIA / fokus",
  "statement": "Element interaktywny ukryty przez aria-hidden=\"true\", ale nadal osiągalny klawiaturą, jest poważnym problemem dostępności.",
  "correct": true,
  "feedbackTrue": "Tak. Element osiągalny fokusem...",
  "feedbackFalse": "Nie. To jest poważny problem...",
  "wcag": ["4.1.2", "2.1.1", "2.4.3"],
  "summary": "Nie wolno zostawiać elementów interaktywnych dostępnych klawiaturą, jeśli są ukryte przed technologiami wspomagającymi.",
  "tags": ["aria-hidden", "focus"]
}
```

## 4. Wymagania walidacyjne

Dla każdego ćwiczenia:

- `id` musi być unikalne,
- `type` musi być obsługiwanym typem,
- `level` musi być jednym z: `basic`, `intermediate`, `advanced`, `expert`,
- `category` nie może być puste,
- `wcag` może być puste tylko wtedy, gdy ćwiczenie nie dotyczy bezpośrednio kryterium,
- dla `single-choice` musi być dokładnie jedna odpowiedź `correct: true`,
- każda odpowiedź musi mieć własne `feedback`,
- dla `true-false` muszą istnieć `feedbackTrue` i `feedbackFalse`,
- `summary` jest wymagane.

## 5. Wynik odpowiedzi

```ts
interface AnswerResult {
  exerciseId: string;
  selectedAnswerId: string | boolean;
  correct: boolean;
  answeredAt: string;
  attemptNumber: number;
  feedbackShown: boolean;
}
```

## 6. Sesja gry

```ts
interface GameSession {
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  mode: GameMode;
  exerciseIds: string[];
  currentIndex: number;
  results: AnswerResult[];
}
```

## 7. Postęp użytkownika

```ts
interface UserProgress {
  userProgressVersion: 1;
  createdAt: string;
  updatedAt: string;
  lastMode?: GameMode;
  lastExerciseId?: string;
  completedExerciseIds: string[];
  incorrectExerciseIds: string[];
  resultsByExerciseId: Record<string, ExerciseProgress>;
  categoryStats: Record<string, CategoryStats>;
  settings: UserSettings;
}
```

## 8. Statystyki kategorii

```ts
interface CategoryStats {
  answered: number;
  correct: number;
  incorrect: number;
  lastAnsweredAt?: string;
}
```

## 9. Ustawienia użytkownika

```ts
interface UserSettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeSpacing: boolean;
  showWcagHints: boolean;
}
```

## 10. Import i eksport

Eksport postępu powinien tworzyć plik:

```text
a11yfirst-lab-postep-YYYY-MM-DD.json
```

Import musi walidować wersję i strukturę. Przy błędzie pokaż konkretny komunikat.
