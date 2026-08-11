import { describe, it } from 'vitest'
import assert from 'node:assert'
import { SignJWT, jwtVerify } from 'jose'

describe('Authentication Logic', () => {
  it('should encrypt and decrypt a JWT session token', async () => {
    const payload = { userId: '123', companyId: 'abc' }
    const secret = new TextEncoder().encode('development_secret_do_not_use_in_prod')
    
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    const verified = await jwtVerify(token, secret)
    
    assert.strictEqual(verified.payload.userId, '123')
    assert.strictEqual(verified.payload.companyId, 'abc')
  })
})
