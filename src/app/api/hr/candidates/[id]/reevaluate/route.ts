import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { EvaluationService } from '@/lib/ai/EvaluationService'
import { ScoringService } from '@/lib/ai/ScoringService'

const prisma = new PrismaClient()

// TODO: In production, wrap this with an auth middleware protecting HR access
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateId } = await params
    
    // Find the latest assessment for this candidate
    const assessment = await prisma.assessment.findFirst({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
        stages: {
          include: {
            submissions: true,
          }
        }
      }
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }
    
    // Also fetch files which are linked directly to Candidate in schema
    const files = await prisma.candidateFile.findMany({
      where: { candidateId }
    })

    const evaluationService = new EvaluationService()
    const scoringService = new ScoringService()

    const stageIds = assessment.stages.map(s => s.id)

    // 1. Delete old AI Results and Score Breakdowns
    await prisma.aIResult.deleteMany({
      where: { assessmentStageId: { in: stageIds } }
    })
    
    await prisma.scoreBreakdown.deleteMany({
      where: { assessmentStageId: { in: stageIds } }
    })

    // 2. Re-trigger evaluations for each applicable stage
    const evalPromises = []

    for (const stage of assessment.stages) {
      if (stage.type === 'TEST') {
        // Just recalculate the test score locally
        await scoringService.calculateTestScore(assessment.id)
      } else {
        // AI Stages
        let content = ''
        if (stage.type === 'VIDEO') {
          const videoFile = files.find(f => f.type === 'VIDEO')
          content = videoFile?.storageKey || ''
        } else {
          content = stage.submissions[0]?.content || ''
        }

        if (content) {
          evalPromises.push(
            evaluationService.evaluateStage(stage.id, {
              assessmentId: assessment.id,
              candidateId: assessment.candidateId,
              content,
              jobContext: assessment.job.description || assessment.job.title
            })
          )
        }
      }
    }

    // Wait for all AI evaluations to finish
    await Promise.allSettled(evalPromises)

    // 3. Recalculate Final Score
    await scoringService.calculateFinalScore(assessment.id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as any
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
