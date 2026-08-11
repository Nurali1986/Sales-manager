import { describe, it } from 'vitest'
import assert from 'node:assert'
import { GET } from '../src/app/api/health/route'

describe('Health Endpoint', () => {
  it('should return status ok', async () => {
    const response = await GET()
    const json = await response.json()
    assert.strictEqual(response.status, 200)
    assert.strictEqual(json.status, 'ok')
  })
})
