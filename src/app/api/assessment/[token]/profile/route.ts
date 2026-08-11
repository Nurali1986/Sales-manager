import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { profileSchema } from '@/lib/validations/candidate'
import { prisma } from '@/lib/db/prisma'
import { AssessmentStageType } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.PROFILE)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    const profileStage = assessment.stages.find(s => s.type === AssessmentStageType.PROFILE)
    if (!profileStage) {
      return NextResponse.json({ error: { code: 'STAGE_NOT_CONFIGURED', message: 'Profile stage not configured.' } }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // Update candidate
      await tx.candidate.update({
        where: { id: assessment.candidateId },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          email: validatedData.email || null,
          city: validatedData.city || null,
        }
      })

      // Link application if needed
      if (!assessment.applicationId) {
        const application = await tx.application.create({
          data: {
            candidateId: assessment.candidateId,
            jobId: assessment.jobId,
            source: 'DIRECT_LINK',
          }
        })
        await tx.assessment.update({
          where: { id: assessment.id },
          data: { applicationId: application.id }
        })
      }

      // Complete stage
      await tx.assessmentStage.update({
        where: { id: profileStage.id },
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
