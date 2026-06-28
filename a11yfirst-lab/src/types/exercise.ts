export type ExerciseType = 'single-choice' | 'true-false';

export type GameMode =
  | 'wcag-detective'
  | 'true-false-auditor'
  | 'aria-surgeon'
  | 'form-sapper'
  | 'keyboard-escape-room'
  | 'alt-arena'
  | 'reportownik';

export type SupportedGameMode = 'wcag-detective' | 'true-false-auditor';

export type ExerciseLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  mode: GameMode;
  level: ExerciseLevel;
  category: string;
  wcag: string[];
  summary: string;
  fix?: string;
  tags: string[];
  estimatedTimeSeconds?: number;
}

export interface SingleChoiceAnswer {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  correct: boolean;
  feedback: string;
}

export interface SingleChoiceExercise extends BaseExercise {
  type: 'single-choice';
  mode: 'wcag-detective';
  question: string;
  answers: SingleChoiceAnswer[];
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  mode: 'true-false-auditor';
  statement: string;
  correct: boolean;
  feedbackTrue: string;
  feedbackFalse: string;
}

export type Exercise = SingleChoiceExercise | TrueFalseExercise;

export interface AnswerResult {
  exerciseId: string;
  selectedAnswerId: string | boolean;
  correct: boolean;
  answeredAt: string;
  attemptNumber: number;
  feedbackShown: boolean;
}

export interface AnswerFeedback {
  result: AnswerResult;
  selectedLabel: string;
  selectedFeedback: string;
  correctLabel: string;
  exercise: Exercise;
}

export interface ExerciseProgress {
  attempts: number;
  lastSelectedAnswerId: string | boolean;
  correct: boolean;
  firstAnsweredAt?: string;
  lastAnsweredAt: string;
}

export interface CategoryStats {
  answered: number;
  correct: number;
  incorrect: number;
  lastAnsweredAt?: string;
}

export interface UserSettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeSpacing: boolean;
  showWcagHints: boolean;
}

export interface UserProgress {
  userProgressVersion: 1;
  createdAt: string;
  updatedAt: string;
  lastMode?: SupportedGameMode;
  lastExerciseId?: string;
  completedExerciseIds: string[];
  incorrectExerciseIds: string[];
  resultsByExerciseId: Record<string, ExerciseProgress>;
  categoryStats: Record<string, CategoryStats>;
  settings: UserSettings;
}

export interface GameSession {
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  mode: SupportedGameMode;
  exerciseIds: string[];
  currentIndex: number;
  results: AnswerResult[];
  repeatIncorrect: boolean;
}

export interface ExerciseSeed {
  version: 1;
  exercises: Exercise[];
}
