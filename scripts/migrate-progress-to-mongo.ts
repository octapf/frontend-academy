/**
 * Migra `data/progress.json` → colección MongoDB (`user_progress` por defecto).
 * Fusiona con documentos existentes (gana la fecha ISO más reciente por clave).
 *
 * Uso:
 *   npx tsx scripts/migrate-progress-to-mongo.ts
 *
 * Requiere en el entorno (p.ej. `.env.local` vía dotenv):
 *   MONGODB_URI
 * Opcional: MONGODB_DB, MONGODB_PROGRESS_COLLECTION
 */

import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";

config({ path: path.join(process.cwd(), ".env.local") });
config({ path: path.join(process.cwd(), ".env") });

type LessonEntry = { viewedAt: string };
type ExerciseEntry = { passedAt: string };

type UserProgress = {
  lessons: Record<string, LessonEntry>;
  exercises: Record<string, ExerciseEntry>;
};

type ProgressFile = {
  users: Record<string, UserProgress>;
};

const DEFAULT_COLLECTION = "user_progress";

function collectionName() {
  return process.env.MONGODB_PROGRESS_COLLECTION?.trim() || DEFAULT_COLLECTION;
}

function mergeLessons(
  a: Record<string, LessonEntry>,
  b: Record<string, LessonEntry>
): Record<string, LessonEntry> {
  const out: Record<string, LessonEntry> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const cur = out[k];
    if (!cur || cur.viewedAt < v.viewedAt) {
      out[k] = v;
    }
  }
  return out;
}

function mergeExercises(
  a: Record<string, ExerciseEntry>,
  b: Record<string, ExerciseEntry>
): Record<string, ExerciseEntry> {
  const out: Record<string, ExerciseEntry> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const cur = out[k];
    if (!cur || cur.passedAt < v.passedAt) {
      out[k] = v;
    }
  }
  return out;
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("Falta MONGODB_URI (definilo en .env.local o en el shell).");
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), "data", "progress.json");
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    console.error(`No se encontró ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(raw) as ProgressFile;
  if (!data.users || typeof data.users !== "object") {
    console.error("progress.json: falta `users`");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  try {
    const dbName = process.env.MONGODB_DB?.trim();
    const db = dbName ? client.db(dbName) : client.db();
    const coll = db.collection(collectionName());
    const usernames = Object.keys(data.users);
    let upserts = 0;

    for (const username of usernames) {
      const fromJson = data.users[username];
      if (!fromJson) continue;

      const existing = await coll.findOne<{ lessons?: unknown; exercises?: unknown }>(
        { username }
      );
      const prevLessons =
        existing?.lessons &&
        typeof existing.lessons === "object" &&
        existing.lessons !== null
          ? (existing.lessons as Record<string, LessonEntry>)
          : {};
      const prevExercises =
        existing?.exercises &&
        typeof existing.exercises === "object" &&
        existing.exercises !== null
          ? (existing.exercises as Record<string, ExerciseEntry>)
          : {};

      const lessons = mergeLessons(prevLessons, fromJson.lessons ?? {});
      const exercises = mergeExercises(prevExercises, fromJson.exercises ?? {});

      await coll.replaceOne(
        { username },
        { username, lessons, exercises },
        { upsert: true }
      );
      upserts += 1;
    }

    console.log(
      `Listo: ${upserts} usuario(s) escritos en "${db.databaseName}"."${collectionName()}".`
    );
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
