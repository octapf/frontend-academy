import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { exerciseRunLimitPerMinute } from "@/lib/rate-limit/exercise-config";
import {
  rateLimitSliding,
  type RateResult,
} from "@/lib/rate-limit/memory-sliding";

let upstashRatelimit: Ratelimit | null | undefined;

function getUpstashRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    return null;
  }
  if (upstashRatelimit === undefined) {
    const redis = new Redis({ url, token });
    const max = exerciseRunLimitPerMinute();
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, "60 s"),
      prefix: "fea:exercise-run",
    });
  }
  return upstashRatelimit;
}

/**
 * Rate limit por clave (p.ej. `exercise-run:${username}`).
 * Si hay `UPSTASH_REDIS_REST_*`, usa Redis (todas las instancias); si no, memoria del proceso.
 */
export async function limitExerciseRun(key: string): Promise<RateResult> {
  const rl = getUpstashRatelimit();
  if (rl) {
    const { success, reset } = await rl.limit(key);
    if (!success) {
      const retryAfterSec = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return { ok: false, retryAfterSec };
    }
    return { ok: true };
  }
  return rateLimitSliding(key, exerciseRunLimitPerMinute());
}
