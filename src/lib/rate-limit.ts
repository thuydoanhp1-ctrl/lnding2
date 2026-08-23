import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

let ratelimit: Ratelimit | null = null;

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
  });
}

/**
 * Checks rate limit for a given identifier (IP or user ID)
 */
export async function checkRateLimit(identifier: string, limit = 20, window = "1 m") {
  if (!ratelimit) {
    // If Upstash is not configured, allow request
    return { success: true, remaining: limit, reset: 0 };
  }

  try {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (err) {
    console.error("❌ Rate limit check error:", err);
    return { success: true, remaining: 1, reset: 0 };
  }
}
