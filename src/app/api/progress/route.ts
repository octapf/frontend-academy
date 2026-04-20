import { NextResponse } from "next/server";
import { z } from "zod";

import { zExerciseId } from "@/exercises/types";
import { getSession } from "@/lib/auth/session";
import {
  getProgressSummary,
  mergeProgress,
  recordExercisePass,
  recordLessonView,
} from "@/lib/progress/progress-store";

export const runtime = "nodejs";

const slugPart = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const postSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("lesson_view"),
    moduleSlug: slugPart,
    lessonSlug: slugPart,
  }),
  z.object({
    action: z.literal("exercise_pass"),
    exerciseId: zExerciseId,
  }),
  z.object({
    action: z.literal("merge"),
    lessonKeys: z
      .array(z.string().min(3).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .max(500)
      .default([]),
    exerciseIds: z.array(zExerciseId).max(200).default([]),
  }),
]);

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getProgressSummary(session.username);
  return NextResponse.json({ ok: true, ...summary });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const body = parsed.data;
  if (body.action === "lesson_view") {
    await recordLessonView(session.username, body.moduleSlug, body.lessonSlug);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "exercise_pass") {
    await recordExercisePass(session.username, body.exerciseId);
    return NextResponse.json({ ok: true });
  }

  await mergeProgress(session.username, body.lessonKeys, body.exerciseIds);
  return NextResponse.json({ ok: true });
}
