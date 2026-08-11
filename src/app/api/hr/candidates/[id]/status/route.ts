import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params
    const { status, applicationId } = await req.json()
    
    const session = await getSession()
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string
    const userId = session.userId as string || 'SYSTEM'

    // Verify ownership
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        candidateId,
        job: { companyId }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found or unauthorized' }, { status: 404 })
    }

    const previousStatus = application.status

    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: applicationId },
        data: { status }
      })

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'CANDIDATE_STATUS_CHANGED',
          entityType: 'Application',
          entityId: applicationId,
          metadata: { previousStatus, newStatus: status, candidateId }
        }
      })
    })

    return NextResponse.json({ success: true, status })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
