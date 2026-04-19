import { tsGreetingExercise } from "@/exercises/ts-greeting";
import { tsPositiveExercise } from "@/exercises/ts-positive";
import { tsSumExercise } from "@/exercises/ts-sum";
import { tsUserLabelExercise } from "@/exercises/ts-user-label";
import type { ExerciseId, TsExercise } from "@/exercises/types";

const BY_ID: Record<ExerciseId, TsExercise> = {
  "ts-sum": tsSumExercise,
  "ts-positive": tsPositiveExercise,
  "ts-greeting": tsGreetingExercise,
  "ts-user-label": tsUserLabelExercise,
};

export function getExercise(id: string): TsExercise | undefined {
  return BY_ID[id as ExerciseId];
}
