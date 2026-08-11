import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)

    const currentStage = AssessmentStageService.getCurrentStage(assessment.stages)
    const progress = AssessmentStageService.getProgress(assessment.stages)

    return NextResponse.json({
      data: {
        assessment: {
          status: assessment.status,
          currentStage,
          progress,
          completedStages: assessment.stages.filter(s => s.status === 'COMPLETED').map(s => s.type)
        },
        job: {
          title: assessment.job.title
        }
      }
    })
  } catch (e: unknown) {
    const error = e as any
    if (error.message === 'Assessment not found') {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'This assessment link is invalid or no longer available.' } }, { status: 404 })
    }
    if (error.message === 'Assessment has expired') {
      return NextResponse.json({ error: { code: 'EXPIRED', message: 'This assessment link has expired.' } }, { status: 400 })
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An internal error occurred.' } }, { status: 500 })
  }
}
