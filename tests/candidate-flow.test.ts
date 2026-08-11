import { describe, it, expect, beforeAll } from 'vitest'
import { prisma } from '../src/lib/db/prisma'

describe('Candidate Assessment Flow API', () => {
  let company: any
  let hr: any
  let job: any
  let candidate: any
  let assessment: any
  let token: string

  beforeAll(async () => {
    // Setup minimal test data
    company = await prisma.company.create({ data: { name: 'Flow Test Co' } })
    
    // Create an HR User (using user model)
    hr = await prisma.user.create({
      data: {
        companyId: company.id,
        email: 'hr@example.com',
        passwordHash: 'hashedpassword',
        role: 'HR'
      }
    })

    // Create a Job Vacancy
    job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: 'Sales Manager',
        status: 'ACTIVE'
      }
    })

    // Create a Candidate Application
    candidate = await prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+998901234567',
        email: 'john@example.com'
      }
    })

    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        status: 'APPLIED'
      }
    })

    // Generate Assessment Token
    assessment = await prisma.assessment.create({
      data: {
        applicationId: application.id,
        candidateId: candidate.id,
        jobId: job.id,
        token: 'test-token-123',
        status: 'NOT_STARTED',
        stages: {
          create: [
            { type: 'PROFILE', order: 1, status: 'NOT_STARTED' },
            { type: 'CV', order: 2, status: 'NOT_STARTED' },
            { type: 'TEST', order: 3, status: 'NOT_STARTED' }
          ]
        }
      },
      include: { stages: true }
    })
    token = assessment.token
  })

  it('should be able to submit profile stage and transition to CV stage', async () => {
    const res = await fetch(`http://localhost:3000/api/assessment/${token}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Updated',
        lastName: 'Flow',
        phone: '123123123'
      })
    })

    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.data.success).toBe(true)

    const updated = await prisma.assessment.findUnique({
      where: { id: assessment.id },
      include: { stages: { orderBy: { order: 'asc' } } }
    })

    expect(updated?.stages[0].status).toBe('COMPLETED') // PROFILE
    expect(updated?.stages[1].status).toBe('IN_PROGRESS') // CV
  })
})
