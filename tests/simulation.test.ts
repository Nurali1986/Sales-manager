import { describe, it, expect, beforeAll } from 'vitest'
import { prisma } from '../src/lib/db/prisma'

describe('Simulation Flow API', () => {
  let company: any
  let hr: any
  let job: any
  let candidate: any
  let assessment: any
  let token: string

  beforeAll(async () => {
    // Setup minimal test data
    company = await prisma.company.create({ data: { name: 'Sim Test Co' } })
    // Create an HR User (using user model)
    hr = await prisma.user.create({
      data: {
        companyId: company.id,
        email: 'simhr@example.com',
        passwordHash: 'hashedpassword',
        role: 'HR'
      }
    })

    job = await prisma.job.create({
      data: {
        title: 'Sales Rep Sim',
        description: 'Test job sim',
        companyId: company.id,
        status: 'ACTIVE'
      }
    })

    candidate = await prisma.candidate.create({
      data: {
        firstName: 'Candidate',
        lastName: 'Sim',
        email: 'cand.sim@test.com',
        phone: '+998901234568'
      }
    })

    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        status: 'APPLIED'
      }
    })

    assessment = await prisma.assessment.create({
      data: {
        applicationId: application.id,
        candidateId: candidate.id,
        jobId: job.id,
        status: 'IN_PROGRESS',
        token: 'sim_token_' + Date.now(),
        stages: {
          create: [
            { type: 'PROFILE', order: 1, status: 'COMPLETED' },
            { type: 'CV', order: 2, status: 'COMPLETED' },
            { type: 'LIVE_SALES', order: 3, status: 'IN_PROGRESS' },
            { type: 'VIDEO', order: 4, status: 'NOT_STARTED' }
          ]
        }
      },
      include: { stages: true }
    })
    token = assessment.token
  })

  it('should be able to get simulation message response', async () => {
    const res = await fetch(`http://localhost:3000/api/assessment/${token}/simulation/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'hello',
        history: []
      })
    })

    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.data.response).toBeDefined()
  })

  it('should be able to complete simulation with transcript', async () => {
    const res = await fetch(`http://localhost:3000/api/assessment/${token}/simulation/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: 'YOU: hello\n\nAI: hi\n\nYOU: bye'
      })
    })

    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.data.success).toBe(true)

    const updated = await prisma.assessment.findUnique({
      where: { id: assessment.id },
      include: { stages: { orderBy: { order: 'asc' } } }
    })

    expect(updated?.stages[2].status).toBe('COMPLETED') // LIVE_SALES
    expect(updated?.stages[3].status).toBe('IN_PROGRESS') // VIDEO
    
    // Check that text submission was created
    const sub = await prisma.textSubmission.findFirst({
      where: { assessmentStageId: updated?.stages[2].id }
    })
    expect(sub?.content).toContain('bye')
  })
})
