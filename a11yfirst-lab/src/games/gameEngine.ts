import type {
  AnswerFeedback,
  AnswerResult,
  Exercise,
  ExerciseLevel,
  GameSession,
  SingleChoiceExercise,
  SupportedGameMode,
  TrueFalseExercise,
  UserProgress
} from '../types/exercise';

export const modeLabels: Record<SupportedGameMode, string> = {
  'wcag-detective': 'Detektyw WCAG',
  'true-false-auditor': 'Prawda/Fałsz Audytora'
};

export const levelLabels: Record<ExerciseLevel, string> = {
  basic: 'podstawowy',
  intermediate: 'średnio zaawansowany',
  advanced: 'zaawansowany',
  expert: 'ekspercki'
};

export function getExercisesForMode(exercises: Exercise[], mode: SupportedGameMode): Exercise[] {
  return exercises.filter((exercise) => exercise.mode === mode);
}

export function getRepeatExercises(exercises: Exercise[], progress: UserProgress): Exercise[] {
  const incorrect = new Set(progress.incorrectExerciseIds);
  return exercises.filter((exercise) => incorrect.has(exercise.id));
}

export function createSession(
  mode: SupportedGameMode,
  exercises: Exercise[],
  repeatIncorrect = false,
  startExerciseId?: string
): GameSession {
  const exerciseIds = exercises.map((exercise) => exercise.id);
  const startIndex = startExerciseId ? Math.max(0, exerciseIds.indexOf(startExerciseId)) : 0;

  return {
    sessionId: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    startedAt: new Date().toISOString(),
    mode,
    exerciseIds,
    currentIndex: startIndex === -1 ? 0 : startIndex,
    results: [],
    repeatIncorrect
  };
}

export function checkAnswer(exercise: Exercise, selectedAnswerId: string | boolean, attemptNumber: number): AnswerFeedback {
  if (exercise.type === 'single-choice') {
    return checkSingleChoice(exercise, String(selectedAnswerId), attemptNumber);
  }

  return checkTrueFalse(exercise, Boolean(selectedAnswerId), attemptNumber);
}

export function getCorrectLabel(exercise: Exercise): string {
  if (exercise.type === 'single-choice') {
    const correct = exercise.answers.find((answer) => answer.correct);
    return correct ? `${correct.id.toUpperCase()}. ${correct.text}` : 'Brak poprawnej odpowiedzi w danych.';
  }

  return exercise.correct ? 'Prawda' : 'Fałsz';
}

export function getSelectedLabel(exercise: Exercise, selectedAnswerId: string | boolean): string {
  if (exercise.type === 'single-choice') {
    const selected = exercise.answers.find((answer) => answer.id === selectedAnswerId);
    return selected ? `${selected.id.toUpperCase()}. ${selected.text}` : 'Nieznana odpowiedź';
  }

  return selectedAnswerId ? 'Prawda' : 'Fałsz';
}

function makeResult(
  exerciseId: string,
  selectedAnswerId: string | boolean,
  correct: boolean,
  attemptNumber: number
): AnswerResult {
  return {
    exerciseId,
    selectedAnswerId,
    correct,
    answeredAt: new Date().toISOString(),
    attemptNumber,
    feedbackShown: true
  };
}

function checkSingleChoice(
  exercise: SingleChoiceExercise,
  selectedAnswerId: string,
  attemptNumber: number
): AnswerFeedback {
  const selected = exercise.answers.find((answer) => answer.id === selectedAnswerId);
  if (!selected) {
    throw new Error('Wybrana odpowiedź nie istnieje.');
  }

  return {
    result: makeResult(exercise.id, selected.id, selected.correct, attemptNumber),
    selectedLabel: `${selected.id.toUpperCase()}. ${selected.text}`,
    selectedFeedback: selected.feedback,
    correctLabel: getCorrectLabel(exercise),
    exercise
  };
}

function checkTrueFalse(
  exercise: TrueFalseExercise,
  selectedAnswerId: boolean,
  attemptNumber: number
): AnswerFeedback {
  const correct = selectedAnswerId === exercise.correct;

  return {
    result: makeResult(exercise.id, selectedAnswerId, correct, attemptNumber),
    selectedLabel: selectedAnswerId ? 'Prawda' : 'Fałsz',
    selectedFeedback: selectedAnswerId ? exercise.feedbackTrue : exercise.feedbackFalse,
    correctLabel: getCorrectLabel(exercise),
    exercise
  };
}
