import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { fileSubmissionSchema } from '@/lib/validations/candidate'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType, AssessmentStatus, ApplicationStatus } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.VIDEO)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = fileSubmissionSchema.parse(body)

    if (!validatedData.storageKey.includes(assessment.candidateId)) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid storage key.' } }, { status: 403 })
    }

    const videoStage = assessment.stages.find(s => s.type === AssessmentStageType.VIDEO)
    if (!videoStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Video stage not configured.' } }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // 1. Create CandidateFile
      await tx.candidateFile.create({
        data: {
          candidateId: assessment.candidateId,
          type: 'VIDEO',
          storageKey: validatedData.storageKey,
          originalFileName: validatedData.originalFileName,
          mimeType: validatedData.mimeType,
          fileSize: validatedData.fileSize
        }
      })

      // 2. Complete Stage
      await tx.assessmentStage.update({
        where: { id: videoStage.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // 3. Mark Assessment Completed
      await tx.assessment.update({
        where: { id: assessment.id },
        data: {
          status: AssessmentStatus.COMPLETED,
          completedAt: new Date()
        }
      })

      // 4. Mark Application Completed (if linked)
      if (assessment.applicationId) {
        await tx.application.update({
          where: { id: assessment.applicationId },
          data: {
            status: ApplicationStatus.COMPLETED,
            updatedAt: new Date()
          }
        })
      }
      
      // We are omitting AI scoring and result placeholder generation for now as per instructions.
    })

    // Trigger AI evaluation asynchronously (fire-and-forget)
    const { EvaluationService } = await import('@/lib/ai/EvaluationService')
    const evaluationService = new EvaluationService()
    evaluationService.evaluateStage(videoStage.id, {
      assessmentId: assessment.id,
      candidateId: assessment.candidateId,
      content: validatedData.storageKey,
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
