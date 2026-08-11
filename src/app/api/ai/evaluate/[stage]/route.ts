import { NextResponse } from 'next/server'
import { PrismaClient, AssessmentStageType } from '@prisma/client'
import { EvaluationService } from '@/lib/ai/EvaluationService'
import { ScoringService } from '@/lib/ai/ScoringService'

const prisma = new PrismaClient()
const evaluationService = new EvaluationService()
const scoringService = new ScoringService()

// This route should ideally be protected by internal service authentication
export async function POST(req: Request, { params }: { params: Promise<{ stage: string }> }) {
  try {
    const { stage } = await params
    const body = await req.json()
    const { assessmentStageId, assessmentId, candidateId, content } = body

    if (!assessmentStageId || !assessmentId || !candidateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const astage = await prisma.assessmentStage.findUnique({
      where: { id: assessmentStageId },
      include: { assessment: { include: { job: true } } }
    })

    if (!astage) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 })
    }

    if (astage.type === 'TEST') {
      // Deterministic test scoring
      await scoringService.calculateTestScore(assessmentId)
      await scoringService.calculateFinalScore(assessmentId)
      return NextResponse.json({ success: true, message: 'Test scored' })
    }

    let extractedContent = content
    if (!extractedContent) {
      // Find submission if not passed directly
      if (astage.type === 'CASE' || astage.type === 'SCRIPT' || astage.type === 'LIVE_SALES') {
        const sub = await prisma.textSubmission.findFirst({
          where: { assessmentStageId, candidateId },
          orderBy: { submittedAt: 'desc' }
        })
        extractedContent = sub?.content || ''
      } else if (astage.type === 'VIDEO' || astage.type === 'CV') {
        const fileType = astage.type === 'VIDEO' ? 'VIDEO' : 'CV'
        const file = await prisma.candidateFile.findFirst({
          where: { candidateId, type: fileType },
          orderBy: { createdAt: 'desc' }
        })
        extractedContent = file?.storageKey || ''
      }
    }

    if (!extractedContent) {
      return NextResponse.json({ error: 'No content to evaluate' }, { status: 400 })
    }

    const input = {
      assessmentId,
      candidateId,
      jobContext: `Role: ${astage.assessment.job.title}\nDescription: ${astage.assessment.job.description}`,
      content: extractedContent
    }

    const result = await evaluationService.evaluateStage(assessmentStageId, input)
    
    // Recalculate final score since a stage score was updated
    await scoringService.calculateFinalScore(assessmentId)

    return NextResponse.json({ success: true, data: result })
  } catch (error: unknown) {
    const err = error as any
    return NextResponse.json({ error: err.message || 'Internal evaluation error' }, { status: 500 })
  }
}
