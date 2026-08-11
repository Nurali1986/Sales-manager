import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// TODO: In production, wrap this with an auth middleware protecting HR access
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params
    
    // Find the latest assessment result
    const assessment = await prisma.assessment.findFirst({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
      include: { results: true }
    })

    if (!assessment || !assessment.results.length) {
      return NextResponse.json({ error: 'Score not found' }, { status: 404 })
    }

    return NextResponse.json({ data: { result: assessment.results[0] } })
  } catch (error: unknown) {
    const err = error as any
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
