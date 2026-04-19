import type { ExerciseId } from "@/exercises/types";

import { isMongoEnvConfigured } from "@/lib/auth/mongo-uri";
import {
  getProgressSummaryJson,
  recordExercisePassJson,
  recordLessonViewJson,
} from "@/lib/progress/progress-store-json";
import {
  getProgressSummaryMongo,
  recordExercisePassMongo,
  recordLessonViewMongo,
} from "@/lib/progress/progress-store-mongo";

export type { UserProgress } from "@/lib/progress/progress-types";

function isMongoConfigured(): boolean {
  return isMongoEnvConfigured();
}

export async function recordLessonView(
  username: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<void> {
  if (isMongoConfigured()) {
    return recordLessonViewMongo(username, moduleSlug, lessonSlug);
  }
  return recordLessonViewJson(username, moduleSlug, lessonSlug);
}

export async function recordExercisePass(
  username: string,
  exerciseId: ExerciseId
): Promise<void> {
  if (isMongoConfigured()) {
    return recordExercisePassMongo(username, exerciseId);
  }
  return recordExercisePassJson(username, exerciseId);
}

export async function getProgressSummary(username: string): Promise<{
  lessonsOpened: number;
  exercisesPassed: number;
  lastActivityIso: string | null;
  lessonKeys: string[];
  exerciseIds: string[];
}> {
  if (isMongoConfigured()) {
    return getProgressSummaryMongo(username);
  }
  return getProgressSummaryJson(username);
}
