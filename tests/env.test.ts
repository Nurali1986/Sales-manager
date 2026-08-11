import { describe, it } from 'vitest'
import assert from 'node:assert'
import { z } from 'zod'

describe('Environment Validation', () => {
  it('should pass with valid mock env variables', () => {
    const envSchema = z.object({
      DATABASE_URL: z.string().url(),
      AUTH_SECRET: z.string().min(16),
    })

    const result = envSchema.safeParse({
      DATABASE_URL: 'postgresql://user:pass@localhost:5433/db',
      AUTH_SECRET: 'this_is_a_very_secret_key_123',
    })

    assert.strictEqual(result.success, true)
  })

  it('should fail with invalid env variables', () => {
    const envSchema = z.object({
      DATABASE_URL: z.string().url(),
      AUTH_SECRET: z.string().min(16),
    })

    const result = envSchema.safeParse({
      DATABASE_URL: 'not-a-url',
      AUTH_SECRET: 'short',
    })

    assert.strictEqual(result.success, false)
  })
})
