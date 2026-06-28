import type { AnswerResult, Exercise, UserProgress, UserSettings } from '../types/exercise';

export const PROGRESS_KEY = 'a11yfirstLabProgress:v1';

const defaultSettings: UserSettings = {
  reduceMotion: false,
  highContrast: false,
  largeSpacing: false,
  showWcagHints: true
};

export function createEmptyProgress(now = new Date().toISOString()): UserProgress {
  return {
    userProgressVersion: 1,
    createdAt: now,
    updatedAt: now,
    completedExerciseIds: [],
    incorrectExerciseIds: [],
    resultsByExerciseId: {},
    categoryStats: {},
    settings: defaultSettings
  };
}

export function getProgress(): { progress: UserProgress; storageAvailable: boolean; message?: string } {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return { progress: createEmptyProgress(), storageAvailable: true };
    }

    return { progress: validateProgress(JSON.parse(raw)), storageAvailable: true };
  } catch {
    return {
      progress: createEmptyProgress(),
      storageAvailable: false,
      message: 'Postęp nie może zostać zapisany w tej przeglądarce.'
    };
  }
}

export function saveProgress(progress: UserProgress): { ok: boolean; message?: string } {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress, null, 2));
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: 'Postęp nie może zostać zapisany w tej przeglądarce.'
    };
  }
}

export function resetProgress(): UserProgress {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // A local in-memory reset still gives the user control when storage is blocked.
  }
  return createEmptyProgress();
}

export function recordAnswer(progress: UserProgress, result: AnswerResult, exercise: Exercise): UserProgress {
  const now = result.answeredAt;
  const previous = progress.resultsByExerciseId[result.exerciseId];
  const attemptNumber = previous ? previous.attempts + 1 : result.attemptNumber;
  const completedExerciseIds = unique([...progress.completedExerciseIds, result.exerciseId]);
  const incorrectExerciseIds = result.correct
    ? progress.incorrectExerciseIds
    : unique([...progress.incorrectExerciseIds, result.exerciseId]);

  const previousCategory = progress.categoryStats[exercise.category] ?? {
    answered: 0,
    correct: 0,
    incorrect: 0
  };

  return {
    ...progress,
    updatedAt: now,
    lastMode: exercise.mode,
    lastExerciseId: result.exerciseId,
    completedExerciseIds,
    incorrectExerciseIds,
    resultsByExerciseId: {
      ...progress.resultsByExerciseId,
      [result.exerciseId]: {
        attempts: attemptNumber,
        lastSelectedAnswerId: result.selectedAnswerId,
        correct: result.correct,
        firstAnsweredAt: previous?.firstAnsweredAt ?? now,
        lastAnsweredAt: now
      }
    },
    categoryStats: {
      ...progress.categoryStats,
      [exercise.category]: {
        answered: previousCategory.answered + 1,
        correct: previousCategory.correct + (result.correct ? 1 : 0),
        incorrect: previousCategory.incorrect + (result.correct ? 0 : 1),
        lastAnsweredAt: now
      }
    }
  };
}

export function updateSettings(progress: UserProgress, settings: UserSettings): UserProgress {
  return {
    ...progress,
    settings,
    updatedAt: new Date().toISOString()
  };
}

export function validateProgress(value: unknown): UserProgress {
  if (!value || typeof value !== 'object') {
    throw new Error('Nie udało się wczytać postępu. Plik nie zawiera obiektu JSON.');
  }

  const candidate = value as Partial<UserProgress>;
  if (candidate.userProgressVersion !== 1) {
    throw new Error('Nie udało się wczytać postępu. Brakuje pola userProgressVersion albo wersja jest nieobsługiwana.');
  }

  if (
    !candidate.createdAt ||
    !candidate.updatedAt ||
    !Array.isArray(candidate.completedExerciseIds) ||
    !Array.isArray(candidate.incorrectExerciseIds) ||
    !candidate.resultsByExerciseId ||
    !candidate.categoryStats ||
    !candidate.settings
  ) {
    throw new Error('Nie udało się wczytać postępu. Brakuje wymaganych pól.');
  }

  return {
    userProgressVersion: 1,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    lastMode: candidate.lastMode,
    lastExerciseId: candidate.lastExerciseId,
    completedExerciseIds: candidate.completedExerciseIds,
    incorrectExerciseIds: candidate.incorrectExerciseIds,
    resultsByExerciseId: candidate.resultsByExerciseId,
    categoryStats: candidate.categoryStats,
    settings: {
      ...defaultSettings,
      ...candidate.settings
    }
  };
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
