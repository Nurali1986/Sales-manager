import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { encrypt } from '@/lib/auth/session'
import { cookies } from 'next/headers'

// POST: Candidate applies to a job — creates Application + Assessment + Stages + StageConfigs
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobId, candidateId } = body

    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'jobId and candidateId required' }, { status: 400 })
    }

    // Check if candidate already applied to this job
    const existing = await prisma.application.findFirst({
      where: { jobId, candidateId },
      include: { assessments: true }
    })

    if (existing && existing.assessments.length > 0) {
      // Return existing assessment token
      return NextResponse.json({
        data: {
          applicationId: existing.id,
          assessmentToken: existing.assessments[0].token,
          alreadyApplied: true
        }
      })
    }

    // Create Application
    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId,
        status: 'IN_PROGRESS',
        source: 'PORTAL'
      }
    })

    // Determine stages based on job title
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    const isSalesManager = job?.title?.includes('Sales Manager') || job?.title?.includes('Sotuv Menejeri')

    const STAGE_CONFIGS = [
      { type: 'CV' as const,         order: 2, weight: 10, maxScore: 100 },
      { type: 'TEST' as const,       order: 3, weight: 15, maxScore: 15  },
      { type: 'CASE' as const,       order: 4, weight: 15, maxScore: 20  },
      { type: 'LIVE_SALES' as const, order: 6, weight: 30, maxScore: 30  },
      { type: 'VIDEO' as const,      order: 7, weight: 15, maxScore: 20  },
    ]

    // For Head of Sales, add SCRIPT stage instead of LIVE_SALES at order 5
    if (!isSalesManager) {
      // Remove LIVE_SALES, add SCRIPT
      const idx = STAGE_CONFIGS.findIndex(s => s.type === 'LIVE_SALES')
      if (idx !== -1) {
        STAGE_CONFIGS[idx] = { type: 'SCRIPT' as any, order: 5, weight: 15, maxScore: 20 }
        // Also add LIVE_SALES back with modified weight for Head of Sales
        // Actually for Head of Sales: SCRIPT replaces LIVE_SALES
      }
    }

    const STAGES_WITH_PROFILE = [
      { type: 'PROFILE' as const, order: 1 },
      ...STAGE_CONFIGS.map(s => ({ type: s.type, order: s.order }))
    ]

    // Create Assessment
    const assessment = await prisma.assessment.create({
      data: {
        applicationId: application.id,
        jobId,
        candidateId,
        status: 'NOT_STARTED',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    // Create Assessment Stages
    for (const stage of STAGES_WITH_PROFILE) {
      await prisma.assessmentStage.create({
        data: {
          assessmentId: assessment.id,
          type: stage.type,
          order: stage.order,
          status: 'NOT_STARTED'
        }
      })
    }

    // Create Stage Configs
    for (const config of STAGE_CONFIGS) {
      await prisma.assessmentStageConfig.create({
        data: {
          assessmentId: assessment.id,
          stageType: config.type,
          weight: config.weight,
          maxScore: config.maxScore
        }
      })
    }

    return NextResponse.json({
      data: {
        applicationId: application.id,
        assessmentToken: assessment.token,
        alreadyApplied: false
      }
    })
  } catch (error: any) {
    console.error('Apply error:', error)
    return NextResponse.json({ error: error.message || 'Failed to apply' }, { status: 500 })
  }
}
