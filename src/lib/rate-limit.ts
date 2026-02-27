import { LRUCache } from "lru-cache";

type Options = {
  limit: number;
  windowMs: number;
};

const cache = new LRUCache<string, { count: number; resetAt: number }>({
  max: 5000,
});

export function rateLimit(key: string, options: Options) {
  const now = Date.now();
  const entry = cache.get(key);
  if (!entry || entry.resetAt < now) {
    cache.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1 };
  }

  if (entry.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  cache.set(key, entry);
  return { allowed: true, remaining: options.limit - entry.count };
}
