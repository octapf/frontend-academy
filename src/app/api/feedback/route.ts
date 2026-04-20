import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth/session";
import { getMongoDb } from "@/lib/auth/mongo-client";
import { isMongoEnvConfigured } from "@/lib/auth/mongo-uri";
import { rateLimitSliding } from "@/lib/rate-limit/memory-sliding";

export const runtime = "nodejs";

const schema = z.object({
  kind: z.literal("exercise"),
  exerciseId: z.string().min(1).max(64),
  vote: z.enum(["like", "dislike"]).optional(),
  comment: z.string().trim().min(3).max(2000).optional(),
});

type FeedbackFile = {
  items: Array<{
    kind: "exercise";
    exerciseId: string;
    vote?: "like" | "dislike";
    comment?: string;
    username: string;
    createdAtIso: string;
  }>;
};

async function writeFeedbackJson(item: FeedbackFile["items"][number]) {
  const { mkdir, readFile, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const DATA_DIR = path.join(process.cwd(), "data");
  const FILE = path.join(DATA_DIR, "feedback.json");

  await mkdir(DATA_DIR, { recursive: true });
  let data: FeedbackFile = { items: [] };
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as FeedbackFile;
    if (parsed && Array.isArray(parsed.items)) data = parsed;
  } catch {
    // ignore
  }
  data.items.unshift(item);
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const fbLimit = rateLimitSliding(`feedback:${session.username}`, 80, 3_600_000);
  if (!fbLimit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Límite de feedback por hora. Probá en ${fbLimit.retryAfterSec}s.`,
      },
      { status: 429 }
    );
  }

  const createdAtIso = new Date().toISOString();
  const doc = {
    ...parsed.data,
    username: session.username,
    createdAtIso,
  };

  try {
    if (isMongoEnvConfigured()) {
      const db = await getMongoDb();
      const coll = db.collection(
        process.env.MONGODB_FEEDBACK_COLLECTION?.trim() || "feedback"
      );
      await coll.insertOne(doc);
    } else {
      await writeFeedbackJson(doc);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Feedback error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

