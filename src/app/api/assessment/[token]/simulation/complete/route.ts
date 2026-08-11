import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.LIVE_SALES)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const simStage = assessment.stages.find(s => s.type === AssessmentStageType.LIVE_SALES)
    if (!simStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Simulation stage not configured.' } }, { status: 400 })
    }

    if (simStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    const { transcript } = await request.json()

    await prisma.$transaction(async (tx) => {
      // 1. Save transcript as TextSubmission
      await tx.textSubmission.create({
        data: {
          assessmentStageId: simStage.id,
          candidateId: assessment.candidateId,
          content: transcript || 'No transcript recorded.'
        }
      })

      // 2. Complete Stage
      await tx.assessmentStage.update({
        where: { id: simStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })
    })

    // Trigger AI evaluation asynchronously (fire-and-forget)
    const { EvaluationService } = await import('@/lib/ai/EvaluationService')
    const evaluationService = new EvaluationService()
    evaluationService.evaluateStage(simStage.id, {
      assessmentId: assessment.id,
      candidateId: assessment.candidateId,
      content: transcript || 'No transcript recorded.',
      jobContext: assessment.job.description || assessment.job.title
    }).catch(console.error)

    return NextResponse.json({ data: { success: true } })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
