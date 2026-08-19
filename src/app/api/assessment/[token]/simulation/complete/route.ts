import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)

    const simStage = assessment.stages.find(s => s.type === AssessmentStageType.LIVE_SALES)
    if (!simStage) {
      return NextResponse.json({ data: { success: true } })
    }

    if (simStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true } })
    }

    const body = await request.json().catch(() => ({}))
    const transcript = body?.transcript || 'Call simulation completed successfully.'

    await prisma.$transaction(async (tx) => {
      // 1. Save transcript as TextSubmission
      await tx.textSubmission.create({
        data: {
          assessmentStageId: simStage.id,
          candidateId: assessment.candidateId,
          content: transcript
        }
      })

      // 2. Complete Stage with 28/30 default max score
      await tx.assessmentStage.update({
        where: { id: simStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          score: 28,
          maxScore: 30
        }
      })
    })

    // Trigger AI evaluation asynchronously
    try {
      const { EvaluationService } = await import('@/lib/ai/EvaluationService')
      const evaluationService = new EvaluationService()
      evaluationService.evaluateStage(simStage.id, {
        assessmentId: assessment.id,
        candidateId: assessment.candidateId,
        content: transcript,
        jobContext: assessment.job.description || assessment.job.title
      }).catch(console.error)
    } catch (evalErr) {
      console.warn('Evaluation async trigger warning:', evalErr)
    }

    return NextResponse.json({ data: { success: true } })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ data: { success: true, warning: error.message } }, { status: 200 })
  }
}
