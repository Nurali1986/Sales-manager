import { PrismaClient, AssessmentStageType, AIResultStatus } from '@prisma/client'
import { IAIEvaluator, EvaluatorInput } from './evaluators/types'
import { CaseEvaluator } from './evaluators/CaseEvaluator'
import { ScriptEvaluator } from './evaluators/ScriptEvaluator'
import { SimulationEvaluator } from './evaluators/SimulationEvaluator'
import { VideoEvaluator } from './evaluators/VideoEvaluator'
import { CVEvaluator } from './evaluators/CVEvaluator'
import { getTextModel } from './gemini/client'

const prisma = new PrismaClient()

// Simple in-memory lock to prevent race conditions on double-submission
const evalLocks = new Set<string>()

export class EvaluationService {
  private getEvaluator(type: AssessmentStageType): IAIEvaluator | null {
    switch (type) {
      case 'CASE': return new CaseEvaluator()
      case 'SCRIPT': return new ScriptEvaluator()
      case 'LIVE_SALES': return new SimulationEvaluator()
      case 'VIDEO': return new VideoEvaluator()
      case 'CV': return new CVEvaluator()
      default: return null
    }
  }

  async evaluateStage(assessmentStageId: string, input: EvaluatorInput, forceReevaluate = false) {
    if (evalLocks.has(assessmentStageId)) {
      throw new Error('Evaluation already in progress for this stage')
    }
    evalLocks.add(assessmentStageId)

    let aiResult: any = null

    try {
      const stage = await prisma.assessmentStage.findUnique({
        where: { id: assessmentStageId },
        include: { aiResults: { orderBy: { createdAt: 'desc' }, take: 1 } }
      })

      if (!stage) throw new Error('Stage not found')

      if (!forceReevaluate && stage.aiResults.length > 0) {
        const latest = stage.aiResults[0]
        if (latest.status === 'COMPLETED' || latest.status === 'PROCESSING') {
          return latest
        }
      }

      const evaluator = this.getEvaluator(stage.type)
      if (!evaluator) throw new Error(`No evaluator for stage type ${stage.type}`)

      aiResult = await prisma.aIResult.create({
        data: {
          assessmentStageId,
          provider: 'GEMINI',
          model: getTextModel(),
          status: 'PENDING'
        }
      })

      await prisma.aIResult.update({ where: { id: aiResult.id }, data: { status: 'PROCESSING' } })

      let result = null
      let retries = 0
      let lastError = null

      while (retries <= 2 && !result) {
        try {
          result = await evaluator.evaluate(input)
        } catch (err: any) {
          lastError = err
          retries++
          if (retries <= 2) {
            await new Promise(res => setTimeout(res, 1000 * Math.pow(2, retries)))
          }
        }
      }

      if (!result) {
        throw lastError || new Error('Evaluation failed after retries')
      }

      await prisma.$transaction(async (tx) => {
        await tx.aIResult.update({
          where: { id: aiResult.id },
          data: {
            status: 'COMPLETED',
            validatedResult: result as any
          }
        })

        for (const crit of result!.criteria) {
          await tx.scoreBreakdown.create({
            data: {
              assessmentStageId,
              category: crit.name,
              score: crit.score,
              maxScore: crit.maxScore,
              weight: 1.0,
              evidence: crit.evidence
            }
          })
        }

        await tx.assessmentStage.update({
          where: { id: assessmentStageId },
          data: { score: result!.score }
        })
      })

      return result

    } catch (error: any) {
      if (aiResult) {
        await prisma.aIResult.update({
          where: { id: aiResult.id },
          data: {
            status: 'FAILED',
            errorMessage: error.message
          }
        }).catch(() => {}) // Ignore update errors if DB is unreachable
      }
      throw error
    } finally {
      evalLocks.delete(assessmentStageId)
    }
  }
}
