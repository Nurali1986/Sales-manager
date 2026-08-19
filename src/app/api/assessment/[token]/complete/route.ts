import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { ScoringService } from '@/lib/ai/ScoringService'
import { prisma } from '@/lib/db/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    // Mark assessment status as COMPLETED
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { status: 'COMPLETED' }
    })

    // Calculate final weighted AI score & recommendation
    const scoringService = new ScoringService()
    const finalScore = await scoringService.calculateFinalScore(assessment.id)

    const result = await prisma.assessmentResult.findFirst({
      where: { assessmentId: assessment.id }
    })

    if (assessment.applicationId) {
      await prisma.application.update({
        where: { id: assessment.applicationId },
        data: {
          status: result?.recommendation === 'ADVANCE' ? 'SHORTLISTED' : 'UNDER_REVIEW'
        }
      })
    }

    return NextResponse.json({ data: { success: true, finalScore, recommendation: result?.recommendation } })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
