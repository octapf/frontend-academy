/** Evita fallos por pegar la URI en Vercel con comillas o saltos de línea. */
export function normalizeMongoUri(raw: string): string {
  let uri = raw.trim().replace(/\r?\n/g, "");
  if (uri.charCodeAt(0) === 0xfeff) {
    uri = uri.slice(1).trim();
  }
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim().replace(/\r?\n/g, "");
  }
  return uri;
}

/** True si hay una URI usable (misma lógica que el cliente Mongo). */
export function isMongoEnvConfigured(): boolean {
  const raw = process.env.MONGODB_URI?.trim();
  if (!raw) return false;
  return normalizeMongoUri(raw).length > 0;
}
