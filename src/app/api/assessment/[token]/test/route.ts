import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'
import { testSubmissionSchema } from '@/lib/validations/candidate'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.TEST)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const questions = await prisma.question.findMany({
      where: { jobId: assessment.jobId },
      orderBy: { order: 'asc' }
    })

    // Remove correct answers before sending to candidate
    const safeQuestions = questions.map(q => ({
      id: q.id,
      category: q.category,
      questionText: q.questionText,
      options: q.options,
      points: q.points,
      order: q.order
    }))

    return NextResponse.json({ data: safeQuestions })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.TEST)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const testStage = assessment.stages.find(s => s.type === AssessmentStageType.TEST)
    if (!testStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Test stage not configured.' } }, { status: 400 })
    }

    // Idempotency check
    if (testStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    const body = await request.json()
    const validatedData = testSubmissionSchema.parse(body)

    const questions = await prisma.question.findMany({
      where: { jobId: assessment.jobId }
    })

    let totalScore = 0
    let maxScore = 0
    const answersToCreate: {
      assessmentStageId: string
      questionId: string
      candidateId: string
      answer: string
      isCorrect: boolean
      score: number
    }[] = []

    for (const q of questions) {
      maxScore += q.points
      const submittedAnswer = validatedData.answers.find(a => a.questionId === q.id)
      
      let isCorrect = false
      let score = 0
      let answerText = submittedAnswer?.answer || ''

      if (submittedAnswer && submittedAnswer.answer === q.correctAnswer) {
        isCorrect = true
        score = q.points
        totalScore += q.points
      }

      answersToCreate.push({
        assessmentStageId: testStage.id,
        questionId: q.id,
        candidateId: assessment.candidateId,
        answer: answerText,
        isCorrect,
        score
      })
    }

    await prisma.$transaction(async (tx) => {
      // 1. Save answers
      await tx.candidateAnswer.createMany({
        data: answersToCreate
      })

      // 2. Complete Stage
      await tx.assessmentStage.update({
        where: { id: testStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          score: totalScore,
          maxScore: maxScore
        }
      })
    })

    return NextResponse.json({ data: { success: true } })
  } catch (e: unknown) {
    const error = e as any
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } }, { status: 400 })
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
