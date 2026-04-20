import { z } from "zod";

export const EXERCISE_IDS = [
  "ts-sum",
  "ts-positive",
  "ts-greeting",
  "ts-user-label",
  "ts-pick-keys",
  "ts-shape-area",
  "ts-parse-query",
  "ts-group-by",
  "ts-safe-json-parse",
  "ts-clamp",
  "ts-unique",
  "ts-classnames",
  "ts-to-title-case",
  "ts-invariant",
  "ts-backoff",
  "ts-error-message",
  "ts-shallow-equal",
  "ts-assert-never",
  "ts-parse-number",
] as const;

export type ExerciseId = (typeof EXERCISE_IDS)[number];

export const zExerciseId = z.enum(EXERCISE_IDS);
