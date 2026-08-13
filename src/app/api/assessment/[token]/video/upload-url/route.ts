import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { fileUploadUrlSchema } from '@/lib/validations/candidate'
import { getPutSignedUrl } from '@/lib/s3'
import { AssessmentStageType } from '@prisma/client'
import crypto from 'crypto'

const ALLOWED_VIDEO_TYPES = ['video/webm', 'video/mp4', 'video/ogg', 'video/quicktime']
const MAX_VIDEO_SIZE_MB = 100

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
    const validatedData = fileUploadUrlSchema.parse(body)

    // Fayl turini tekshirish
    if (!ALLOWED_VIDEO_TYPES.includes(validatedData.mimeType)) {
      return NextResponse.json(
        { error: { code: 'INVALID_FILE_TYPE', message: 'Only WebM, MP4, OGG, and MOV video files are allowed.' } },
        { status: 400 }
      )
    }

    // Fayl hajmini tekshirish
    if (validatedData.fileSize > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: { code: 'FILE_TOO_LARGE', message: `Video must be smaller than ${MAX_VIDEO_SIZE_MB}MB.` } },
        { status: 400 }
      )
    }

    const fileId = crypto.randomUUID()
    const storageKey = `assessments/${assessment.id}/candidate/${assessment.candidateId}/video/${fileId}`

    const uploadUrl = await getPutSignedUrl(storageKey, validatedData.mimeType, 3600)

    return NextResponse.json({ data: { uploadUrl, storageKey } })
  } catch (e: unknown) {
    const error = e as any
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } }, { status: 400 })
    }
    console.error('[Video Upload URL] Error:', error)
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to generate upload URL.' } }, { status: 500 })
  }
}
