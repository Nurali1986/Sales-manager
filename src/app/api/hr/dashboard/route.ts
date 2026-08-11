import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string

    // Get total applications
    const totalApplications = await prisma.application.count({
      where: { job: { companyId } }
    })

    // Get assessments started
    const assessmentsStarted = await prisma.assessment.count({
      where: { 
        job: { companyId },
        status: { in: ['IN_PROGRESS', 'COMPLETED', 'PROCESSING'] }
      }
    })

    // Get assessments completed
    const assessmentsCompleted = await prisma.assessment.count({
      where: { 
        job: { companyId },
        status: 'COMPLETED'
      }
    })

    // Get shortlisted candidates
    const shortlisted = await prisma.application.count({
      where: { 
        job: { companyId },
        status: 'SHORTLISTED'
      }
    })
    
    // Get rejected candidates
    const rejected = await prisma.application.count({
      where: { 
        job: { companyId },
        status: 'REJECTED'
      }
    })

    // Get average score
    const avgScoreResult = await prisma.assessmentResult.aggregate({
      where: { assessment: { job: { companyId } } },
      _avg: { totalScore: true }
    })

    // Get active vacancies
    const activeVacancies = await prisma.job.count({
      where: { companyId, status: 'ACTIVE' }
    })

    // Get pending review
    const pendingReview = await prisma.application.count({
      where: {
        job: { companyId },
        status: { in: ['APPLIED', 'IN_PROGRESS', 'COMPLETED', 'UNDER_REVIEW'] },
        assessments: { some: { status: 'COMPLETED' } }
      }
    })

    const recentCandidates = await prisma.assessment.findMany({
      where: { 
        job: { companyId },
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
      include: {
        candidate: true,
        job: true,
        results: true
      }
    })

    return NextResponse.json({
      data: {
        totalApplications,
        assessmentsStarted,
        assessmentsCompleted,
        shortlisted,
        rejected,
        averageScore: avgScoreResult._avg.totalScore || 0,
        activeVacancies,
        pendingReview,
        recentCandidates
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
