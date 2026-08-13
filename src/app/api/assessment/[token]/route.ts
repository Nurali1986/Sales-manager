import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { rateLimit } from '@/lib/security/rateLimit'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Rate limiting: brute-force token hujumiga qarshi — 1 daqiqada max 30 ta so'rov
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (!rateLimit(`assessment:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Juda ko\'p so\'rov. Iltimos, biroz kuting.' } },
        { status: 429 }
      )
    }

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
