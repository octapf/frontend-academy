import type { ExerciseId } from "@/exercises/types";

import { LESSON_CODE_EXERCISES } from "@/lib/learn/lesson-code-exercises";
import { lessonProgressKey } from "@/lib/progress/keys";

const EXERCISE_BY_LESSON_KEY: Record<string, ExerciseId> = (() => {
  const m: Record<string, ExerciseId> = {};
  for (const e of LESSON_CODE_EXERCISES) {
    m[lessonProgressKey(e.moduleSlug, e.lessonSlug)] = e.exerciseId as ExerciseId;
  }
  return m;
})();

/** Si la lección tiene ejercicio de código asociado, devuelve su id. */
export function exerciseIdForLesson(
  moduleSlug: string,
  lessonSlug: string,
): ExerciseId | undefined {
  return EXERCISE_BY_LESSON_KEY[lessonProgressKey(moduleSlug, lessonSlug)];
}

/** Ejercicios que aparecen en al menos una lección de este módulo. */
export function exerciseIdsInModule(moduleSlug: string): ExerciseId[] {
  const set = new Set<ExerciseId>();
  for (const e of LESSON_CODE_EXERCISES) {
    if (e.moduleSlug === moduleSlug) set.add(e.exerciseId as ExerciseId);
  }
  return [...set].sort();
}
