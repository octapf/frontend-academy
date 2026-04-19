import type { ExerciseId } from "./ids";

export type { ExerciseId } from "./ids";
export { EXERCISE_IDS, zExerciseId } from "./ids";

export type Localized = { es: string; en: string };

export type TsExercise = {
  id: ExerciseId;
  kind: "typescript";
  title: Localized;
  description: Localized;
  starter: string;
};
