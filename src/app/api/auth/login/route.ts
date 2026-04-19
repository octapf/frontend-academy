import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import { publicMongoErrorHint } from "@/lib/auth/mongo-error-hint";
import { signSessionToken } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { findUser } from "@/lib/auth/user-store";

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

    let user;
    try {
      user = await findUser(username);
    } catch (e) {
      console.error("[api/auth/login] findUser", e);
      const hint = publicMongoErrorHint(e);
      return NextResponse.json(
        { ok: false, error: mongoHint, ...(hint ? { hint } : {}) },
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
