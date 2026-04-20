import type { ExerciseId } from "@/exercises/types";

import { lessonProgressKey } from "@/lib/progress/keys";

/** Lección que aloja cada ejercicio de código (para UI de progreso). */
const LESSON_KEY_BY_EXERCISE: Record<ExerciseId, string> = {
  "ts-sum": lessonProgressKey("react", "hooks-basics"),
  "ts-positive": lessonProgressKey("typescript", "narrowing"),
  "ts-greeting": lessonProgressKey("typescript", "string-templates"),
  "ts-user-label": lessonProgressKey("typescript", "utility-types"),
  "ts-pick-keys": lessonProgressKey("typescript", "generics-pick"),
  "ts-shape-area": lessonProgressKey("typescript", "discriminated-unions"),
  "ts-parse-query": lessonProgressKey("typescript", "url-search-params"),
  "ts-group-by": lessonProgressKey("typescript", "array-reduce"),
  "ts-safe-json-parse": lessonProgressKey("typescript", "json-parse"),
};

const EXERCISE_BY_LESSON_KEY = Object.fromEntries(
  (Object.entries(LESSON_KEY_BY_EXERCISE) as [ExerciseId, string][]).map(
    ([id, key]) => [key, id]
  )
) as Record<string, ExerciseId>;

/** Si la lección tiene ejercicio de código asociado, devuelve su id. */
export function exerciseIdForLesson(
  moduleSlug: string,
  lessonSlug: string
): ExerciseId | undefined {
  return EXERCISE_BY_LESSON_KEY[lessonProgressKey(moduleSlug, lessonSlug)];
}

/** Ejercicios cuya lección anfitriona pertenece a este módulo. */
export function exerciseIdsInModule(moduleSlug: string): ExerciseId[] {
  const prefix = `${moduleSlug}/`;
  return (Object.entries(LESSON_KEY_BY_EXERCISE) as [ExerciseId, string][])
    .filter(([, lessonKey]) => lessonKey.startsWith(prefix))
    .map(([id]) => id);
}
