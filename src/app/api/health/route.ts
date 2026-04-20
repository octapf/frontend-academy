import { NextResponse } from "next/server";

import { getJwtSecretKey } from "@/lib/auth/secret";
import { getMongoDb } from "@/lib/auth/mongo-client";
import { isMongoEnvConfigured, mongoUriScheme } from "@/lib/auth/mongo-uri";

export const runtime = "nodejs";

export async function GET() {
  const auth: { ok: boolean; error?: string } = { ok: true };
  try {
    getJwtSecretKey();
  } catch (e) {
    auth.ok = false;
    auth.error = e instanceof Error ? e.message : "AUTH_SECRET error";
  }

  const db: { configured: boolean; ok: boolean; scheme: string | null; error?: string } = {
    configured: isMongoEnvConfigured(),
    ok: true,
    scheme: null,
  };

  if (db.configured) {
    try {
      db.scheme = process.env.MONGODB_URI ? mongoUriScheme(process.env.MONGODB_URI) : null;
      const mongo = await getMongoDb();
      await mongo.command({ ping: 1 });
    } catch (e) {
      db.ok = false;
      db.error = e instanceof Error ? e.message : "Mongo error";
    }
  }

  const ok = auth.ok && (!db.configured || db.ok);
  return NextResponse.json(
    {
      ok,
      auth,
      db,
      nodeEnv: process.env.NODE_ENV,
    },
    { status: ok ? 200 : 503 }
  );
}

