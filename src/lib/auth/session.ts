import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/jwt";

export type Session = { username: string };

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await verifySessionToken(token);
    const sub = payload.sub;
    if (typeof sub !== "string" || !sub) return null;
    return { username: sub };
  } catch {
    return null;
  }
}
