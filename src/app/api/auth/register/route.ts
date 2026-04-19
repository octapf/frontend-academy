import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE } from "@/lib/auth/constants";
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

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { username, password } = parsed.data;
  const existing = await findUser(username);
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
    throw e;
  }

  const token = await signSessionToken(username);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
