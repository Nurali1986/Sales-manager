import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth/session'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { applicationIds, status } = await req.json()
    
    if (!Array.isArray(applicationIds) || !status) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const session = await getSession()
    if (!session || !session.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const companyId = session.companyId as string
    const userId = session.userId as string || 'SYSTEM'

    // Verify ownership of all applications
    const applications = await prisma.application.findMany({
      where: {
        id: { in: applicationIds },
        job: { companyId }
      }
    })

    if (applications.length !== applicationIds.length) {
      return NextResponse.json({ error: 'One or more applications not found or unauthorized' }, { status: 403 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.application.updateMany({
        where: { id: { in: applicationIds } },
        data: { status }
      })

      const logs = applications.map(app => ({
        companyId,
        userId,
        action: 'BULK_STATUS_CHANGED',
        entityType: 'Application',
        entityId: app.id,
        metadata: { previousStatus: app.status, newStatus: status, candidateId: app.candidateId }
      }))

      await tx.auditLog.createMany({ data: logs })
    })

    return NextResponse.json({ success: true, count: applications.length, status })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update statuses' }, { status: 500 })
  }
}
