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
  // Pegado típico en Vercel / docs: "MONGODB_URI=mongodb+srv://..."
  uri = uri.replace(/^MONGODB_URI\s*=\s*/i, "");
  // Si quedó algún prefijo antes del scheme, recortarlo (sin exponer secretos)
  const idx = uri.indexOf("mongodb://");
  const idxSrv = uri.indexOf("mongodb+srv://");
  const best =
    idx >= 0 && idxSrv >= 0 ? Math.min(idx, idxSrv) : Math.max(idx, idxSrv);
  if (best > 0) {
    uri = uri.slice(best);
  }
  return uri;
}

export function mongoUriScheme(raw: string): string | null {
  const uri = normalizeMongoUri(raw);
  if (uri.startsWith("mongodb+srv://")) return "mongodb+srv://";
  if (uri.startsWith("mongodb://")) return "mongodb://";
  return null;
}

/** True si hay una URI usable (misma lógica que el cliente Mongo). */
export function isMongoEnvConfigured(): boolean {
  const raw = process.env.MONGODB_URI?.trim();
  if (!raw) return false;
  return normalizeMongoUri(raw).length > 0;
}
