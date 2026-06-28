import type {
  Exercise,
  ExerciseLevel,
  ExerciseSeed,
  ExerciseType,
  GameMode,
  SingleChoiceExercise,
  TrueFalseExercise
} from '../types/exercise';

const exerciseTypes: ExerciseType[] = ['single-choice', 'true-false'];
const levels: ExerciseLevel[] = ['basic', 'intermediate', 'advanced', 'expert'];
const supportedModes: GameMode[] = ['wcag-detective', 'true-false-auditor'];
const answerIds = ['a', 'b', 'c', 'd'];

export class ExerciseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExerciseValidationError';
  }
}

export function validateExerciseSeed(seed: ExerciseSeed): ExerciseSeed {
  if (!seed || seed.version !== 1 || !Array.isArray(seed.exercises)) {
    throw new ExerciseValidationError('Seed ćwiczeń musi mieć version: 1 oraz tablicę exercises.');
  }

  const ids = new Set<string>();
  seed.exercises.forEach((exercise, index) => {
    validateBaseExercise(exercise, index);

    if (ids.has(exercise.id)) {
      throw new ExerciseValidationError(`Ćwiczenie ma zduplikowane ID: ${exercise.id}.`);
    }
    ids.add(exercise.id);

    if (exercise.type === 'single-choice') {
      validateSingleChoice(exercise);
    }

    if (exercise.type === 'true-false') {
      validateTrueFalse(exercise);
    }
  });

  return seed;
}

function validateBaseExercise(exercise: Exercise, index: number): void {
  const prefix = `Ćwiczenie ${index + 1}`;

  if (!exercise.id || typeof exercise.id !== 'string') {
    throw new ExerciseValidationError(`${prefix}: brakuje id.`);
  }

  if (!exerciseTypes.includes(exercise.type)) {
    throw new ExerciseValidationError(`${exercise.id}: nieobsługiwany typ ćwiczenia.`);
  }

  if (!supportedModes.includes(exercise.mode)) {
    throw new ExerciseValidationError(`${exercise.id}: tryb nie jest obsługiwany w MVP.`);
  }

  if (!levels.includes(exercise.level)) {
    throw new ExerciseValidationError(`${exercise.id}: niepoprawny poziom trudności.`);
  }

  if (!exercise.category.trim()) {
    throw new ExerciseValidationError(`${exercise.id}: kategoria nie może być pusta.`);
  }

  if (!Array.isArray(exercise.wcag)) {
    throw new ExerciseValidationError(`${exercise.id}: wcag musi być tablicą.`);
  }

  if (!exercise.summary.trim()) {
    throw new ExerciseValidationError(`${exercise.id}: summary jest wymagane.`);
  }

  if (!Array.isArray(exercise.tags)) {
    throw new ExerciseValidationError(`${exercise.id}: tags musi być tablicą.`);
  }
}

function validateSingleChoice(exercise: SingleChoiceExercise): void {
  if (!exercise.question.trim()) {
    throw new ExerciseValidationError(`${exercise.id}: question jest wymagane.`);
  }

  if (!Array.isArray(exercise.answers) || exercise.answers.length !== 4) {
    throw new ExerciseValidationError(`${exercise.id}: ABCD musi mieć dokładnie 4 odpowiedzi.`);
  }

  const correctAnswers = exercise.answers.filter((answer) => answer.correct);
  if (correctAnswers.length !== 1) {
    throw new ExerciseValidationError(`${exercise.id}: musi istnieć dokładnie jedna poprawna odpowiedź.`);
  }

  const ids = new Set<string>();
  exercise.answers.forEach((answer) => {
    if (!answerIds.includes(answer.id)) {
      throw new ExerciseValidationError(`${exercise.id}: odpowiedź ma niepoprawne id.`);
    }
    if (ids.has(answer.id)) {
      throw new ExerciseValidationError(`${exercise.id}: odpowiedź ${answer.id} jest zduplikowana.`);
    }
    if (!answer.text.trim() || !answer.feedback.trim()) {
      throw new ExerciseValidationError(`${exercise.id}: każda odpowiedź musi mieć tekst i informację zwrotną.`);
    }
    ids.add(answer.id);
  });
}

function validateTrueFalse(exercise: TrueFalseExercise): void {
  if (!exercise.statement.trim()) {
    throw new ExerciseValidationError(`${exercise.id}: statement jest wymagane.`);
  }

  if (typeof exercise.correct !== 'boolean') {
    throw new ExerciseValidationError(`${exercise.id}: correct musi być boolean.`);
  }

  if (!exercise.feedbackTrue.trim() || !exercise.feedbackFalse.trim()) {
    throw new ExerciseValidationError(`${exercise.id}: Prawda/Fałsz musi mieć informację zwrotną dla obu odpowiedzi.`);
  }
}
