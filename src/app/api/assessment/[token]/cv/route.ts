import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { fileSubmissionSchema } from '@/lib/validations/candidate'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.CV)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = fileSubmissionSchema.parse(body)

    // Validate storage key belongs to candidate
    if (!validatedData.storageKey.includes(assessment.candidateId)) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid storage key.' } }, { status: 403 })
    }

    const cvStage = assessment.stages.find(s => s.type === AssessmentStageType.CV)
    if (!cvStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'CV stage not configured.' } }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // 1. Create CandidateFile
      await tx.candidateFile.create({
        data: {
          candidateId: assessment.candidateId,
          type: 'CV',
          storageKey: validatedData.storageKey,
          originalFileName: validatedData.originalFileName,
          mimeType: validatedData.mimeType,
          fileSize: validatedData.fileSize
        }
      })

      // 2. Complete Stage
      await tx.assessmentStage.update({
        where: { id: cvStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
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
