import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import {
  getMongoDriverCode,
  publicFileStoreErrorHint,
  publicMongoErrorHint,
} from "@/lib/auth/mongo-error-hint";
import { signSessionToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { createUser, findUser } from "@/lib/auth/user-store";

const bodySchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, _ y -"),
  password: z.string().min(8).max(128),
});

const mongoHint =
  "No se pudo conectar a la base de datos. Revisá en Vercel: MONGODB_URI, MONGODB_DB y en Atlas → Network Access (p. ej. 0.0.0.0/0).";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      return NextResponse.json(
        {
          ok: false,
          error: "Datos inválidos",
          issues: flat.fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    let existing;
    try {
      existing = await findUser(username);
    } catch (e) {
      console.error("[api/auth/register] findUser", e);
      const hint = publicMongoErrorHint(e);
      return NextResponse.json(
        { ok: false, error: mongoHint, ...(hint ? { hint } : {}) },
        { status: 503 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "El usuario ya existe" },
        { status: 409 }
      );
    }

    try {
      await createUser(username, hashPassword(password));
    } catch (e) {
      if (e instanceof Error && e.message === "USERNAME_TAKEN") {
        return NextResponse.json(
          { ok: false, error: "El usuario ya existe" },
          { status: 409 }
        );
      }
      console.error("[api/auth/register] createUser", e);
      const hint = [publicMongoErrorHint(e), publicFileStoreErrorHint(e)]
        .filter(Boolean)
        .join(" ");
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

    let token: string;
    try {
      token = await signSessionToken(username);
    } catch (e) {
      console.error("[api/auth/register] signSessionToken", e);
      return NextResponse.json(
        {
          ok: false,
          error:
            "El servidor no pudo crear la sesión. En producción hace falta AUTH_SECRET de al menos 32 caracteres en las variables de entorno.",
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
    console.error("[api/auth/register] unhandled", e);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Error inesperado del servidor. Revisá los logs de la función en Vercel (Runtime Logs).",
      },
      { status: 500 }
    );
  }
}
