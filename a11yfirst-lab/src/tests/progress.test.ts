import { describe, expect, it } from 'vitest';
import { exercises } from '../data/exercises';
import { checkAnswer } from '../games/gameEngine';
import { createEmptyProgress, recordAnswer, validateProgress } from '../progress/progressStore';

describe('postęp użytkownika', () => {
  it('zapisuje odpowiedź i oznacza błędne ćwiczenie do powtórki', () => {
    const exercise = exercises.find((item) => item.type === 'single-choice');
    expect(exercise).toBeDefined();
    if (!exercise || exercise.type !== 'single-choice') {
      return;
    }

    const wrongAnswer = exercise.answers.find((answer) => !answer.correct);
    expect(wrongAnswer).toBeDefined();
    const feedback = checkAnswer(exercise, wrongAnswer?.id ?? 'a', 1);
    const progress = recordAnswer(createEmptyProgress('2026-06-27T10:00:00.000Z'), feedback.result, exercise);

    expect(progress.completedExerciseIds).toContain(exercise.id);
    expect(progress.incorrectExerciseIds).toContain(exercise.id);
    expect(progress.resultsByExerciseId[exercise.id].attempts).toBe(1);
  });

  it('zwraca konkretny błąd przy niepoprawnej strukturze importu', () => {
    expect(() => validateProgress({ userProgressVersion: 1 })).toThrow(/Brakuje wymaganych pól/);
  });
});
