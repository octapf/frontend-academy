import { NextResponse } from "next/server";
import { z } from "zod";

import type { ExerciseId } from "@/exercises/types";
import { zExerciseId } from "@/exercises/types";
import { getSession } from "@/lib/auth/session";
import { getExercise } from "@/exercises/index";
import { limitExerciseRun } from "@/lib/rate-limit/exercise-run-limit";
import { recordExercisePass } from "@/lib/progress/progress-store";
import { runTsGreeting } from "@/lib/exercises/run-ts-greeting";
import { runTsGroupBy } from "@/lib/exercises/run-ts-group-by";
import { runTsParseQuery } from "@/lib/exercises/run-ts-parse-query";
import { runTsPickKeys } from "@/lib/exercises/run-ts-pick-keys";
import { runTsPositive } from "@/lib/exercises/run-ts-positive";
import { runTsSafeJsonParse } from "@/lib/exercises/run-ts-safe-json-parse";
import { runTsShapeArea } from "@/lib/exercises/run-ts-shape-area";
import { runTsSum } from "@/lib/exercises/run-ts-sum";
import { runTsUserLabel } from "@/lib/exercises/run-ts-user-label";

export const runtime = "nodejs";

const bodySchema = z.object({
  exerciseId: zExerciseId,
  code: z.string().max(50_000),
});

export async function POST(req: Request) {
  const session = await getSession();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";
  const rlKey = session ? `exercise-run:${session.username}` : `exercise-run:guest:${ip}`;
  const rl = await limitExerciseRun(rlKey);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Demasiadas ejecuciones. Probá en unos segundos." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const { exerciseId, code } = parsed.data;
  const exercise = getExercise(exerciseId);
  if (!exercise || exercise.kind !== "typescript") {
    return NextResponse.json({ ok: false, error: "Unknown exercise" }, { status: 404 });
  }

  const runners: Partial<
    Record<ExerciseId, (src: string) => unknown>
  > = {
    "ts-sum": runTsSum,
    "ts-positive": runTsPositive,
    "ts-greeting": runTsGreeting,
    "ts-user-label": runTsUserLabel,
    "ts-pick-keys": runTsPickKeys,
    "ts-shape-area": runTsShapeArea,
    "ts-parse-query": runTsParseQuery,
    "ts-group-by": runTsGroupBy,
    "ts-safe-json-parse": runTsSafeJsonParse,
  };

  const run = runners[exercise.id];
  if (!run) {
    return NextResponse.json(
      { ok: false, error: "Unsupported exercise" },
      { status: 400 }
    );
  }

  const result = run(code) as { ok: boolean };
  if (result.ok && session) {
    await recordExercisePass(session.username, exercise.id);
  }

  return NextResponse.json(result);
}
