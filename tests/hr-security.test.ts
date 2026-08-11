import { describe, it, expect, vi } from 'vitest'
import { GET } from '../src/app/api/hr/candidates/[id]/route'

vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn().mockResolvedValue({ companyId: 'company-a', userId: 'user-1' })
}))

const mockPrisma = vi.hoisted(() => ({
  candidate: {
    findFirst: vi.fn()
  }
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    candidate = mockPrisma.candidate
  }
}))

describe('HR Security - Tenant Isolation', () => {
  it('should prevent access to candidates from another company', async () => {
    // Simulate candidate not found because they belong to company-b
    mockPrisma.candidate.findFirst.mockResolvedValueOnce(null)
    
    const req = new Request('http://localhost:3000/api/hr/candidates/cand-123')
    const res = await GET(req, { params: Promise.resolve({ id: 'cand-123' }) })
    const json = await res.json()
    
    expect(res.status).toBe(404)
    expect(json.error).toBe('Candidate not found or unauthorized')
    
    // Check that the query included the companyId filter
    expect(mockPrisma.candidate.findFirst).toHaveBeenCalledWith({
      where: expect.objectContaining({
        id: 'cand-123',
        applications: {
          some: { job: { companyId: 'company-a' } }
        }
      }),
      include: expect.any(Object)
    })
  })
})
