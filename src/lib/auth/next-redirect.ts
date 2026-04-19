/** Ruta interna segura para `?next=` (evita open redirects). */
export function sanitizeNextParam(
  value: string | null | undefined
): string | null {
  if (!value || typeof value !== "string") return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

export function authPageHref(
  path: "/login" | "/register",
  next: string | null
): string {
  if (!next) return path;
  return `${path}?next=${encodeURIComponent(next)}`;
}
