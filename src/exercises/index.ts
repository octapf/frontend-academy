import { tsGreetingExercise } from "@/exercises/ts-greeting";
import { tsBackoffExercise } from "@/exercises/ts-backoff";
import { tsAssertNeverExercise } from "@/exercises/ts-assert-never";
import { tsClampExercise } from "@/exercises/ts-clamp";
import { tsClassnamesExercise } from "@/exercises/ts-classnames";
import { tsErrorMessageExercise } from "@/exercises/ts-error-message";
import { tsGroupByExercise } from "@/exercises/ts-group-by";
import { tsInvariantExercise } from "@/exercises/ts-invariant";
import { tsParseNumberExercise } from "@/exercises/ts-parse-number";
import { tsParseQueryExercise } from "@/exercises/ts-parse-query";
import { tsPickKeysExercise } from "@/exercises/ts-pick-keys";
import { tsSafeJsonParseExercise } from "@/exercises/ts-safe-json-parse";
import { tsShallowEqualExercise } from "@/exercises/ts-shallow-equal";
import { tsShapeAreaExercise } from "@/exercises/ts-shape-area";
import { tsToTitleCaseExercise } from "@/exercises/ts-to-title-case";
import { tsUniqueExercise } from "@/exercises/ts-unique";
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
  "ts-clamp": tsClampExercise,
  "ts-unique": tsUniqueExercise,
  "ts-classnames": tsClassnamesExercise,
  "ts-to-title-case": tsToTitleCaseExercise,
  "ts-invariant": tsInvariantExercise,
  "ts-backoff": tsBackoffExercise,
  "ts-error-message": tsErrorMessageExercise,
  "ts-shallow-equal": tsShallowEqualExercise,
  "ts-assert-never": tsAssertNeverExercise,
  "ts-parse-number": tsParseNumberExercise,
};

export function getExercise(id: string): TsExercise | undefined {
  return BY_ID[id as ExerciseId];
}
