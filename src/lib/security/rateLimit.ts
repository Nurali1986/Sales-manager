// Simple in-memory rate limiter for MVP
// In a true production environment, you would use Redis (e.g. @upstash/ratelimit)

type RateLimitStore = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitStore>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = store.get(key)

  if (!record) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count += 1
  return true
}

// Cleanup interval to prevent memory leaks in the Map
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) {
      store.delete(key)
    }
  }
}, 60000) // Cleanup every minute
