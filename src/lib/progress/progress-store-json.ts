import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ExerciseId } from "@/exercises/types";

import { lessonProgressKey } from "@/lib/progress/keys";
import type { UserProgress } from "@/lib/progress/progress-types";

const DATA_DIR = path.join(process.cwd(), "data");
const PROGRESS_FILE = path.join(DATA_DIR, "progress.json");

type ProgressFile = {
  users: Record<string, UserProgress>;
};

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readSafe(): Promise<ProgressFile> {
  try {
    const raw = await readFile(PROGRESS_FILE, "utf8");
    const parsed = JSON.parse(raw) as ProgressFile;
    if (!parsed.users || typeof parsed.users !== "object") {
      return { users: {} };
    }
    return parsed;
  } catch {
    return { users: {} };
  }
}

async function writeAll(data: ProgressFile) {
  await ensureDataDir();
  await writeFile(PROGRESS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function emptyUser(): UserProgress {
  return { lessons: {}, exercises: {} };
}

export async function recordLessonViewJson(
  username: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<void> {
  const key = lessonProgressKey(moduleSlug, lessonSlug);
  const data = await readSafe();
  const u = data.users[username] ?? emptyUser();
  if (!u.lessons[key]) {
    u.lessons[key] = { viewedAt: new Date().toISOString() };
  }
  data.users[username] = u;
  await writeAll(data);
}

export async function recordExercisePassJson(
  username: string,
  exerciseId: ExerciseId
): Promise<void> {
  const data = await readSafe();
  const u = data.users[username] ?? emptyUser();
  u.exercises[exerciseId] = { passedAt: new Date().toISOString() };
  data.users[username] = u;
  await writeAll(data);
}

export async function getProgressSummaryJson(username: string): Promise<{
  lessonsOpened: number;
  exercisesPassed: number;
  lastActivityIso: string | null;
  lessonKeys: string[];
  exerciseIds: string[];
}> {
  const data = await readSafe();
  const u = data.users[username];
  if (!u) {
    return {
      lessonsOpened: 0,
      exercisesPassed: 0,
      lastActivityIso: null,
      lessonKeys: [],
      exerciseIds: [],
    };
  }

  const lessonTimes = Object.values(u.lessons).map((x) => x.viewedAt);
  const exerciseTimes = Object.values(u.exercises).map((x) => x.passedAt);
  const all = [...lessonTimes, ...exerciseTimes];
  const last = all.length
    ? all.reduce((best, t) => (t > best ? t : best), all[0]!)
    : null;

  return {
    lessonsOpened: Object.keys(u.lessons).length,
    exercisesPassed: Object.keys(u.exercises).length,
    lastActivityIso: last,
    lessonKeys: Object.keys(u.lessons),
    exerciseIds: Object.keys(u.exercises),
  };
}
