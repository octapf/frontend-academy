import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { findUser, updateUserPasswordHash } from "@/lib/auth/user-store";
import { getMongoDriverCode, publicMongoErrorHint } from "@/lib/auth/mongo-error-hint";
import { rateLimitSliding } from "@/lib/rate-limit/memory-sliding";

export const runtime = "nodejs";

const bodySchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128),
});

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimitSliding(
    `change-password:${session.username}`,
    MAX_ATTEMPTS,
    WINDOW_MS
  );
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Demasiados intentos. Probá de nuevo en ${limited.retryAfterSec}s.`,
      },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  let user;
  try {
    user = await findUser(session.username);
  } catch (e) {
    console.error("[api/auth/change-password] findUser", e);
    const hint = publicMongoErrorHint(e);
    const code = getMongoDriverCode(e);
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo leer el usuario.",
        ...(hint ? { hint } : {}),
        ...(code !== undefined ? { mongoCode: code } : {}),
      },
      { status: 503 }
    );
  }

  if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
    return NextResponse.json(
      { ok: false, error: "La contraseña actual no es correcta." },
      { status: 401 }
    );
  }

  try {
    await updateUserPasswordHash(session.username, hashPassword(newPassword));
  } catch (e) {
    console.error("[api/auth/change-password] updateUserPasswordHash", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo actualizar la contraseña." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
