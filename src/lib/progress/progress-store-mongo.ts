import type { Document } from "mongodb";

import type { ExerciseId } from "@/exercises/types";
import { getMongoDb } from "@/lib/auth/mongo-client";
import { lessonProgressKey } from "@/lib/progress/keys";
import type { UserProgress } from "@/lib/progress/progress-types";

const DEFAULT_COLLECTION = "user_progress";
const USERNAME_FIELD = "username";

function collectionName() {
  return process.env.MONGODB_PROGRESS_COLLECTION?.trim() || DEFAULT_COLLECTION;
}

function docToSummary(doc: Document | null): {
  lessonsOpened: number;
  exercisesPassed: number;
  lastActivityIso: string | null;
  lessonKeys: string[];
  exerciseIds: string[];
} {
  if (!doc) {
    return {
      lessonsOpened: 0,
      exercisesPassed: 0,
      lastActivityIso: null,
      lessonKeys: [],
      exerciseIds: [],
    };
  }
  const lessons = (doc.lessons ?? {}) as UserProgress["lessons"];
  const exercises = (doc.exercises ?? {}) as UserProgress["exercises"];
  const lessonTimes = Object.values(lessons).map((x) => x.viewedAt);
  const exerciseTimes = Object.values(exercises).map((x) => x.passedAt);
  const all = [...lessonTimes, ...exerciseTimes];
  const last = all.length
    ? all.reduce((best, t) => (t > best ? t : best), all[0]!)
    : null;
  return {
    lessonsOpened: Object.keys(lessons).length,
    exercisesPassed: Object.keys(exercises).length,
    lastActivityIso: last,
    lessonKeys: Object.keys(lessons),
    exerciseIds: Object.keys(exercises),
  };
}

export async function recordLessonViewMongo(
  username: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<void> {
  const db = await getMongoDb();
  const coll = db.collection(collectionName());
  const key = lessonProgressKey(moduleSlug, lessonSlug);
  const viewedAt = new Date().toISOString();
  await coll.updateOne(
    { [USERNAME_FIELD]: username, [`lessons.${key}`]: { $exists: false } },
    {
      $set: { [`lessons.${key}`]: { viewedAt } },
      $setOnInsert: { [USERNAME_FIELD]: username, exercises: {} },
    },
    { upsert: true }
  );
}

export async function recordExercisePassMongo(
  username: string,
  exerciseId: ExerciseId
): Promise<void> {
  const db = await getMongoDb();
  const coll = db.collection(collectionName());
  const passedAt = new Date().toISOString();
  await coll.updateOne(
    { [USERNAME_FIELD]: username },
    {
      $set: { [`exercises.${exerciseId}`]: { passedAt } },
      $setOnInsert: { [USERNAME_FIELD]: username, lessons: {} },
    },
    { upsert: true }
  );
}

export async function getProgressSummaryMongo(username: string): Promise<{
  lessonsOpened: number;
  exercisesPassed: number;
  lastActivityIso: string | null;
  lessonKeys: string[];
  exerciseIds: string[];
}> {
  const db = await getMongoDb();
  const coll = db.collection(collectionName());
  const doc = await coll.findOne({ [USERNAME_FIELD]: username });
  return docToSummary(doc);
}
