import { describe, expect, it } from 'vitest';
import seed from '../../a11yfirst_lab_codex_pack/data/a11yfirst_lab_seed_exercises.json';
import { exercises } from '../data/exercises';
import { ExerciseValidationError, validateExerciseSeed } from '../data/validateExercises';

describe('ćwiczenia', () => {
  it('ładuje ćwiczenia z JSON', () => {
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.some((exercise) => exercise.mode === 'wcag-detective')).toBe(true);
    expect(exercises.some((exercise) => exercise.mode === 'true-false-auditor')).toBe(true);
    expect(exercises.filter((exercise) => exercise.mode === 'wcag-detective').length).toBeGreaterThan(9);
    expect(exercises.filter((exercise) => exercise.mode === 'true-false-auditor').length).toBeGreaterThan(9);
  });

  it('waliduje strukturę seedów', () => {
    expect(() => validateExerciseSeed(seed as never)).not.toThrow();
  });

  it('odrzuca ABCD bez dokładnie jednej poprawnej odpowiedzi', () => {
    const invalid = structuredClone(seed) as typeof seed;
    const first = (invalid.exercises as Array<{ type: string; answers?: Array<{ correct: boolean }> }>).find(
      (exercise) => exercise.type === 'single-choice'
    );
    if (!first?.answers) {
      throw new Error('Brak ćwiczenia single-choice w seedzie testowym.');
    }
    first.answers.forEach((answer) => {
      answer.correct = false;
    });

    expect(() => validateExerciseSeed(invalid as never)).toThrow(ExerciseValidationError);
  });
});
