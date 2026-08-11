import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'
import { scriptSubmissionSchema } from '@/lib/validations/candidate'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.SCRIPT)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const scriptStage = assessment.stages.find(s => s.type === AssessmentStageType.SCRIPT)
    let draft = ''
    if (scriptStage) {
      const submission = await prisma.textSubmission.findFirst({
        where: { assessmentStageId: scriptStage.id }
      })
      if (submission) {
        draft = submission.content
      }
    }

    // MVP script prompt
    const scriptPrompt = `Siz mebel ishlab chiqaruvchi fabrikamizning Sales Managerisiz.

Yangi mijoz sizga murojaat qildi.

Mijoz bilan birinchi qo'ng'iroq uchun sotuv scriptini yozing.

Script quyidagilarni o'z ichiga olsin:

1. Salomlashish
2. Aloqani o'rnatish
3. Ehtiyojni aniqlash
4. Mahsulotni taqdim qilish
5. E'tiroz bilan ishlash
6. Keyingi qadam / yopish`

    return NextResponse.json({ data: { prompt: scriptPrompt, draft } })
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
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.SCRIPT)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const scriptStage = assessment.stages.find(s => s.type === AssessmentStageType.SCRIPT)
    if (!scriptStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Script stage not configured.' } }, { status: 400 })
    }

    if (scriptStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    const body = await request.json()
    const content = typeof body.content === 'string' ? body.content : ''

    const existing = await prisma.textSubmission.findFirst({
      where: { assessmentStageId: scriptStage.id }
    })

    if (existing) {
      await prisma.textSubmission.update({
        where: { id: existing.id },
        data: { content }
      })
    } else {
      await prisma.textSubmission.create({
        data: {
          assessmentStageId: scriptStage.id,
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
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.SCRIPT)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const scriptStage = assessment.stages.find(s => s.type === AssessmentStageType.SCRIPT)
    if (!scriptStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Script stage not configured.' } }, { status: 400 })
    }

    if (scriptStage.status === 'COMPLETED') {
      return NextResponse.json({ data: { success: true, message: 'Already completed' } })
    }

    const body = await request.json()
    const validatedData = scriptSubmissionSchema.parse(body)

    await prisma.$transaction(async (tx) => {
      const existing = await tx.textSubmission.findFirst({
        where: { assessmentStageId: scriptStage.id }
      })

      if (existing) {
        await tx.textSubmission.update({
          where: { id: existing.id },
          data: { content: validatedData.content }
        })
      } else {
        await tx.textSubmission.create({
          data: {
            assessmentStageId: scriptStage.id,
            candidateId: assessment.candidateId,
            content: validatedData.content
          }
        })
      }

      // 2. Complete Stage
      await tx.assessmentStage.update({
        where: { id: scriptStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })
    })

    // Trigger AI evaluation asynchronously (fire-and-forget)
    const { EvaluationService } = await import('@/lib/ai/EvaluationService')
    const evaluationService = new EvaluationService()
    evaluationService.evaluateStage(scriptStage.id, {
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
