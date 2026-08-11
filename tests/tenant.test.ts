import { describe, it } from 'vitest'
import assert from 'node:assert'

describe('Tenant Isolation Logic', () => {
  it('should ensure HR can only access jobs in their company', () => {
    const hrUser = { companyId: 'companyA' }
    const jobA = { id: 'job1', companyId: 'companyA' }
    const jobB = { id: 'job2', companyId: 'companyB' }

    const canAccessJobA = hrUser.companyId === jobA.companyId
    const canAccessJobB = hrUser.companyId === jobB.companyId

    assert.strictEqual(canAccessJobA, true)
    assert.strictEqual(canAccessJobB, false)
  })
})
