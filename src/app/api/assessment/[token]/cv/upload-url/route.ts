import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { fileUploadUrlSchema } from '@/lib/validations/candidate'
import { AssessmentStageType } from '@prisma/client'
import crypto from 'crypto'

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
    const validatedData = fileUploadUrlSchema.parse(body)

    // Generate a secure, randomized storage key
    const fileId = crypto.randomUUID()
    const storageKey = `assessments/${assessment.id}/candidate/${assessment.candidateId}/cv/${fileId}`

    // MOCK: In reality, we'd generate a presigned URL using AWS SDK
    // const s3 = new S3Client({...})
    // const command = new PutObjectCommand({ Bucket, Key: storageKey, ContentType: validatedData.mimeType })
    // const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    
    const uploadUrl = `https://mock-s3-bucket.example.com/${storageKey}`

    return NextResponse.json({ data: { uploadUrl, storageKey } })
  } catch (e: unknown) {
    const error = e as any
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } }, { status: 400 })
    }
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
