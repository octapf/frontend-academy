import { z } from "zod";

export const EXERCISE_IDS = [
  "ts-sum",
  "ts-positive",
  "ts-greeting",
  "ts-user-label",
] as const;

export type ExerciseId = (typeof EXERCISE_IDS)[number];

export const zExerciseId = z.enum(EXERCISE_IDS);
