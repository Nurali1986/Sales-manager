import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { prisma } from '@/lib/db/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    const allStagesCompleted = assessment.stages.every(s => s.status === 'COMPLETED')
    
    if (!allStagesCompleted) {
      return NextResponse.json({ error: { code: 'INCOMPLETE', message: 'Not all stages are completed.' } }, { status: 400 })
    }

    if (assessment.status === 'COMPLETED' || assessment.status === 'PROCESSING') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    // Set to PROCESSING to trigger Phase 4 AI background jobs (or COMPLETED if doing synchronously)
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { status: 'PROCESSING' }
    })

    return NextResponse.json({ data: { success: true } })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
