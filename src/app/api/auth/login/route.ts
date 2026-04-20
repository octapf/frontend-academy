import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import { getMongoDriverCode, publicMongoErrorHint } from "@/lib/auth/mongo-error-hint";
import { signSessionToken } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { findUser } from "@/lib/auth/user-store";
import { getRequestIp } from "@/lib/rate-limit/request-ip";
import { rateLimitSliding } from "@/lib/rate-limit/memory-sliding";

export const runtime = "nodejs";

const bodySchema = z.object({
  username: z.string().min(1).max(32),
  password: z.string().min(1).max(128),
});

const mongoHint =
  "No se pudo conectar a la base de datos. Revisá MONGODB_URI, MONGODB_DB y Atlas → Network Access.";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

    const { username, password } = parsed.data;

    const ip = getRequestIp(req);
    const loginLimit = rateLimitSliding(`login:${ip}`, 40, 60_000);
    if (!loginLimit.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Demasiados intentos desde esta red. Probá en ${loginLimit.retryAfterSec}s.`,
        },
        { status: 429 }
      );
    }

    let user;
    try {
      user = await findUser(username);
    } catch (e) {
      console.error("[api/auth/login] findUser", e);
      const hint = publicMongoErrorHint(e);
      const code = getMongoDriverCode(e);
      return NextResponse.json(
        {
          ok: false,
          error: mongoHint,
          ...(hint ? { hint } : {}),
          ...(code !== undefined ? { mongoCode: code } : {}),
        },
        { status: 503 }
      );
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    let token: string;
    try {
      token = await signSessionToken(user.username);
    } catch (e) {
      console.error("[api/auth/login] signSessionToken", e);
      return NextResponse.json(
        {
          ok: false,
          error:
            "El servidor no pudo crear la sesión. En producción hace falta AUTH_SECRET de al menos 32 caracteres.",
        },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error("[api/auth/login] unhandled", e);
    return NextResponse.json(
      { ok: false, error: "Error inesperado del servidor. Revisá los logs en Vercel." },
      { status: 500 }
    );
  }
}
