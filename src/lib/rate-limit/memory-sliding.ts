/**
 * Rate limit en memoria (por proceso). Suficiente para un solo servidor;
 * en múltiples instancias usar Redis/Upstash.
 */
const WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();

export type RateResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function rateLimitSliding(
  key: string,
  maxInWindow: number,
  windowMs: number = WINDOW_MS
): RateResult {
  const now = Date.now();
  let stamps = buckets.get(key) ?? [];
  stamps = stamps.filter((t) => now - t < windowMs);
  if (stamps.length >= maxInWindow) {
    const oldest = stamps[0]!;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    return { ok: false, retryAfterSec };
  }
  stamps.push(now);
  buckets.set(key, stamps);
  return { ok: true };
}
