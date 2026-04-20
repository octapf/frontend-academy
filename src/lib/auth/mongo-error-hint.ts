/** Código numérico del driver (p. ej. MongoServerError.code), sin datos sensibles. */
export function getMongoDriverCode(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null) return undefined;
  const c = (err as { code?: unknown }).code;
  return typeof c === "number" ? c : undefined;
}

/**
 * Vercel: filesystem de la función es de solo lectura salvo /tmp; escribir `data/users.json` falla.
 */
export function publicFileStoreErrorHint(err: unknown): string | undefined {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  if (
    msg.includes("erofs") ||
    msg.includes("read-only file system") ||
    msg.includes("eacces") ||
    msg.includes("enospc")
  ) {
    return "Este entorno no puede guardar usuarios en disco. En Vercel definí MONGODB_URI (y redeploy) para usar MongoDB.";
  }
  return undefined;
}

/**
 * Mensaje corto para el cliente (sin datos sensibles). Basado en textos típicos del driver / Atlas.
 */
export function publicMongoErrorHint(err: unknown): string | undefined {
  const code = getMongoDriverCode(err);
  if (code === 18) {
    return "MongoDB código 18: autenticación fallida. Usuario/contraseña de la URI no coinciden con Database Access en Atlas (contraseña URL-encoded si tiene símbolos).";
  }
  if (code === 13) {
    return "MongoDB código 13: no autorizado. El Database User no tiene permisos sobre esta base/colección. En Atlas → Database Access, dale rol readWrite (o mayor) sobre la DB usada (por ej. frontendacademy).";
  }

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
  if (lower.includes("not authorized") || lower.includes("unauthorized")) {
    return "MongoDB no autorizó la operación. Revisá roles del Database User en Atlas (readWrite sobre la DB objetivo) y que MONGODB_DB apunte a esa DB.";
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
