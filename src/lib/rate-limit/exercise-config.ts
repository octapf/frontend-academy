/** Máximo de `POST /api/exercises/run` por usuario y ventana de ~1 min (memoria o Upstash). */
export function exerciseRunLimitPerMinute(): number {
  const raw = process.env.EXERCISE_RUN_RATE_LIMIT_PER_MIN;
  const n = raw ? Number.parseInt(raw, 10) : 40;
  if (!Number.isFinite(n)) return 40;
  return Math.max(5, Math.min(120, n));
}
