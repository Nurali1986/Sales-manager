import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'
import { getSignedUrl } from '@/lib/s3'

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params
    const { searchParams } = new URL(req.url)
    const fileId = searchParams.get('fileId')
    
    const session = await getSession()
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string

    // Verify ownership
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        applications: {
          some: { job: { companyId } }
        }
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found or unauthorized' }, { status: 404 })
    }

    // Find file
    let file
    if (fileId) {
      file = await prisma.candidateFile.findFirst({ where: { id: fileId, candidateId } })
    } else {
      file = await prisma.candidateFile.findFirst({ where: { candidateId, type: 'CV' }, orderBy: { createdAt: 'desc' } })
    }

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Generate signed URL
    const url = await getSignedUrl(file.storageKey)

    // Audit log
    await prisma.auditLog.create({
      data: {
        companyId,
        userId: session.userId as string || 'SYSTEM',
        action: 'FILE_VIEWED',
        entityType: 'CandidateFile',
        entityId: file.id,
        metadata: { candidateId, type: file.type }
      }
    })

    return NextResponse.json({ data: { url, fileName: file.originalFileName, mimeType: file.mimeType } })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 })
  }
}
