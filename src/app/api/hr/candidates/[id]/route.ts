import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params
    const session = await getSession()
    
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string

    // Find candidate and ensure they applied to a job at this company
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        applications: {
          some: { job: { companyId } }
        }
      },
      include: {
        applications: {
          where: { job: { companyId } },
          include: { job: true }
        },
        assessments: {
          orderBy: { createdAt: 'desc' },
          include: {
            results: { orderBy: { createdAt: 'desc' } },
            stages: {
              orderBy: { order: 'asc' },
              include: {
                aiResults: { orderBy: { createdAt: 'desc' }, take: 1 },
                scoreBreakdowns: true,
                answers: { include: { question: true } },
                submissions: { orderBy: { submittedAt: 'desc' }, take: 1 }
              }
            }
          }
        },
        files: { orderBy: { createdAt: 'desc' } }
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ data: candidate })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load candidate' }, { status: 500 })
  }
}
