/**
 * HS256 secret for JWT sessions. Set AUTH_SECRET in production (32+ chars recommended).
 */
export function getJwtSecretKey(): Uint8Array {
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    return new TextEncoder().encode(fromEnv);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set to a string of at least 32 characters.");
  }
  // Dev-only fallback so `npm run dev` works without .env (do not use in prod).
  return new TextEncoder().encode(
    "dev-only-fea-session-secret-32chars!!"
  );
}
