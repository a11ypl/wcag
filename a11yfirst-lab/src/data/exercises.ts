import seed from '../../a11yfirst_lab_codex_pack/data/a11yfirst_lab_seed_exercises.json';
import type { Exercise, ExerciseSeed } from '../types/exercise';
import { validateExerciseSeed } from './validateExercises';

export const exerciseSeed = validateExerciseSeed(seed as ExerciseSeed);

export const exercises: Exercise[] = exerciseSeed.exercises;
