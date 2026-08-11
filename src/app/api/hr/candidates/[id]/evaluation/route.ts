import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// TODO: In production, wrap this with an auth middleware protecting HR access
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params
    
    // Find the latest assessment for this candidate
    const assessment = await prisma.assessment.findFirst({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
      include: {
        results: true,
        stages: {
          include: {
            aiResults: { orderBy: { createdAt: 'desc' }, take: 1 },
            scoreBreakdowns: true
          }
        }
      }
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 })
    }

    return NextResponse.json({ data: { assessment } })
  } catch (error: unknown) {
    const err = error as any
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
