import { tsGreetingExercise } from "@/exercises/ts-greeting";
import { tsGroupByExercise } from "@/exercises/ts-group-by";
import { tsParseQueryExercise } from "@/exercises/ts-parse-query";
import { tsPickKeysExercise } from "@/exercises/ts-pick-keys";
import { tsSafeJsonParseExercise } from "@/exercises/ts-safe-json-parse";
import { tsShapeAreaExercise } from "@/exercises/ts-shape-area";
import { tsPositiveExercise } from "@/exercises/ts-positive";
import { tsSumExercise } from "@/exercises/ts-sum";
import { tsUserLabelExercise } from "@/exercises/ts-user-label";
import type { ExerciseId, TsExercise } from "@/exercises/types";

const BY_ID: Record<ExerciseId, TsExercise> = {
  "ts-sum": tsSumExercise,
  "ts-positive": tsPositiveExercise,
  "ts-greeting": tsGreetingExercise,
  "ts-user-label": tsUserLabelExercise,
  "ts-pick-keys": tsPickKeysExercise,
  "ts-shape-area": tsShapeAreaExercise,
  "ts-parse-query": tsParseQueryExercise,
  "ts-group-by": tsGroupByExercise,
  "ts-safe-json-parse": tsSafeJsonParseExercise,
};

export function getExercise(id: string): TsExercise | undefined {
  return BY_ID[id as ExerciseId];
}
