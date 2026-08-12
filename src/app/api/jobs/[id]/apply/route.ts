import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Standard assessment stages configuration for the MVP
const DEFAULT_STAGES = [
  { type: 'PROFILE', order: 1 },
  { type: 'CV', order: 2 },
  { type: 'TEST', order: 3 },
  { type: 'CASE', order: 4 },
  { type: 'SCRIPT', order: 5 },
  { type: 'LIVE_SALES', order: 6 },
  { type: 'VIDEO', order: 7 }
]

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params
    const body = await req.json()
    const { firstName, lastName, phone } = body

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ error: 'First name, last name, and phone are required' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job || job.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Job is not available' }, { status: 404 })
    }

    // 1. Find or create candidate
    let candidate = await prisma.candidate.findUnique({
      where: { phone }
    })

    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: { firstName, lastName, phone }
      })
    } else {
      // Update names if they changed
      candidate = await prisma.candidate.update({
        where: { id: candidate.id },
        data: { firstName, lastName }
      })
    }

    // 2. Create Application
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        status: 'IN_PROGRESS',
        source: 'CAREERS_PAGE'
      }
    })

    // 3. Create Assessment and Token
    const rawToken = crypto.randomUUID()
    const secureTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days validity

    const assessment = await prisma.assessment.create({
      data: {
        jobId: job.id,
        candidateId: candidate.id,
        applicationId: application.id,
        token: rawToken, // legacy field fallback
        secureTokenHash: secureTokenHash,
        status: 'NOT_STARTED',
        expiresAt: expiresAt
      }
    })

    // 4. Create standard stages
    const stageData = DEFAULT_STAGES.map(s => ({
      assessmentId: assessment.id,
      type: s.type as any,
      order: s.order,
      status: 'NOT_STARTED' as any
    }))

    await prisma.assessmentStage.createMany({
      data: stageData
    })

    return NextResponse.json({ data: { token: rawToken } })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
