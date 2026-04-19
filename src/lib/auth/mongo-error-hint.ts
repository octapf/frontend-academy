/**
 * Mensaje corto para el cliente (sin datos sensibles). Basado en textos típicos del driver / Atlas.
 */
export function publicMongoErrorHint(err: unknown): string | undefined {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (
    lower.includes("authentication failed") ||
    lower.includes("bad auth") ||
    lower.includes("bad credentials") ||
    lower.includes("mongoservererror: bad auth")
  ) {
    return "Atlas rechazó usuario o contraseña. Regenerá la contraseña del usuario de BD, pegá la URI nueva en Vercel y si la contraseña tiene @ # : / ? & encodéala en la URI.";
  }
  if (
    lower.includes("server selection timed out") ||
    lower.includes("mongotimeouterror") ||
    lower.includes("timed out")
  ) {
    return "Timeout al conectar: cluster pausado, red, o URI/host incorrectos. En Atlas comprobá que el cluster esté activo.";
  }
  if (
    lower.includes("enotfound") ||
    lower.includes("querysrv") ||
    lower.includes("getaddrinfo")
  ) {
    return "No se resolvió el host del cluster. Copiá la connection string desde Atlas → Connect → Drivers (mismo proyecto que el cluster).";
  }
  if (lower.includes("isn't whitelisted") || lower.includes("not allowed to access")) {
    return "Atlas bloqueó la IP: en Network Access permití 0.0.0.0/0 o el rango que uses.";
  }
  if (lower.includes("mongodb_uri is not set")) {
    return "Falta la variable MONGODB_URI en Vercel (Environment Variables) para este proyecto.";
  }
  return undefined;
}
