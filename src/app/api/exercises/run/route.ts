import { NextResponse } from "next/server";
import { z } from "zod";

import type { ExerciseId } from "@/exercises/types";
import { zExerciseId } from "@/exercises/types";
import { getSession } from "@/lib/auth/session";
import { getExercise } from "@/exercises/index";
import { limitExerciseRun } from "@/lib/rate-limit/exercise-run-limit";
import { recordExercisePass } from "@/lib/progress/progress-store";
import { runTsGreeting } from "@/lib/exercises/run-ts-greeting";
import { runTsPositive } from "@/lib/exercises/run-ts-positive";
import { runTsSum } from "@/lib/exercises/run-ts-sum";
import { runTsUserLabel } from "@/lib/exercises/run-ts-user-label";

const bodySchema = z.object({
  exerciseId: zExerciseId,
  code: z.string().max(50_000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const rl = await limitExerciseRun(`exercise-run:${session.username}`);
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
  };

  const run = runners[exercise.id];
  if (!run) {
    return NextResponse.json(
      { ok: false, error: "Unsupported exercise" },
      { status: 400 }
    );
  }

  const result = run(code) as { ok: boolean };
  if (result.ok) {
    await recordExercisePass(session.username, exercise.id);
  }

  return NextResponse.json(result);
}
