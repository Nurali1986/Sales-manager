import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'
import { caseSubmissionSchema } from '@/lib/validations/candidate'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.CASE)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const caseStage = assessment.stages.find(s => s.type === AssessmentStageType.CASE)
    let draft = ''
    if (caseStage) {
      const submission = await prisma.textSubmission.findFirst({
        where: { assessmentStageId: caseStage.id }
      })
      if (submission) {
        draft = submission.content
      }
    }

    // For MVP, case content is hardcoded. Later this will come from Job configs.
    const caseContent = `Tasavvur qiling, siz bizning mebel ishlab chiqarish fabrikamizda Sales Manager sifatida ishlayapsiz.

Sizga yangi mijoz murojaat qildi.
Mijoz 100 dona ofis stuli va 20 dona ish stoli sotib olishni rejalashtirmoqda.

Mijoz narxni juda yuqori deb hisoblamoqda.

Siz qanday ishlaysiz?

Quyidagilarni yozing:

1. Mijoz bilan ishlash ketma-ketligi
2. Qanday savollar berasiz?
3. E'tirozni qanday ishlaysiz?
4. Qanday qilib kelishuvga olib kelasiz?`

    return NextResponse.json({ data: { content: caseContent, draft } })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.CASE)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const caseStage = assessment.stages.find(s => s.type === AssessmentStageType.CASE)
    if (!caseStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Case stage not configured.' } }, { status: 400 })
    }

    if (caseStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    const body = await request.json()
    // For autosave, allow any length
    const content = typeof body.content === 'string' ? body.content : ''

    const existing = await prisma.textSubmission.findFirst({
      where: { assessmentStageId: caseStage.id }
    })

    if (existing) {
      await prisma.textSubmission.update({
        where: { id: existing.id },
        data: { content }
      })
    } else {
      await prisma.textSubmission.create({
        data: {
          assessmentStageId: caseStage.id,
          candidateId: assessment.candidateId,
          content
        }
      })
    }

    return NextResponse.json({ data: { success: true } })
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
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.CASE)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const caseStage = assessment.stages.find(s => s.type === AssessmentStageType.CASE)
    if (!caseStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Case stage not configured.' } }, { status: 400 })
    }

    if (caseStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    const body = await request.json()
    const validatedData = caseSubmissionSchema.parse(body)

    await prisma.$transaction(async (tx) => {
      const existing = await tx.textSubmission.findFirst({
        where: { assessmentStageId: caseStage.id }
      })

      if (existing) {
        await tx.textSubmission.update({
          where: { id: existing.id },
          data: { content: validatedData.content }
        })
      } else {
        await tx.textSubmission.create({
          data: {
            assessmentStageId: caseStage.id,
            candidateId: assessment.candidateId,
            content: validatedData.content
          }
        })
      }

      // 2. Complete Stage
      await tx.assessmentStage.update({
        where: { id: caseStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })
    })

    // Trigger AI evaluation asynchronously (fire-and-forget)
    const { EvaluationService } = await import('@/lib/ai/EvaluationService')
    const evaluationService = new EvaluationService()
    evaluationService.evaluateStage(caseStage.id, {
      assessmentId: assessment.id,
      candidateId: assessment.candidateId,
      content: validatedData.content,
      jobContext: assessment.job.description || assessment.job.title
    }).catch(console.error)

    return NextResponse.json({ data: { success: true } })
  } catch (e: unknown) {
    const error = e as any
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } }, { status: 400 })
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
