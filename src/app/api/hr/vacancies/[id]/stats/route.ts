import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params
    const session = await getSession()
    
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string

    // Validate ownership
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId }
    })
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const applications = await prisma.application.count({ where: { jobId } })
    
    const started = await prisma.assessment.count({ 
      where: { jobId, status: { in: ['IN_PROGRESS', 'COMPLETED', 'PROCESSING'] } } 
    })
    
    const completed = await prisma.assessment.count({ 
      where: { jobId, status: 'COMPLETED' } 
    })

    const evaluated = await prisma.assessmentResult.count({
      where: { assessment: { jobId } }
    })

    const shortlisted = await prisma.application.count({ where: { jobId, status: 'SHORTLISTED' } })
    const interview = await prisma.application.count({ where: { jobId, status: 'INTERVIEW' } })
    const hired = await prisma.application.count({ where: { jobId, status: 'HIRED' } })
    const rejected = await prisma.application.count({ where: { jobId, status: 'REJECTED' } })

    // Score distribution
    const results = await prisma.assessmentResult.findMany({
      where: { assessment: { jobId }, totalScore: { not: null } },
      select: { totalScore: true }
    })

    const distribution = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      '<60': 0
    }

    for (const r of results) {
      const score = Math.round(r.totalScore!)
      if (score >= 90) distribution['90-100']++
      else if (score >= 80) distribution['80-89']++
      else if (score >= 70) distribution['70-79']++
      else if (score >= 60) distribution['60-69']++
      else distribution['<60']++
    }

    return NextResponse.json({
      data: {
        funnel: {
          applications,
          started,
          completed,
          evaluated,
          shortlisted,
          interview,
          hired,
          rejected
        },
        distribution
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
