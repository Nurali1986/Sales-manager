import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ScoringService {
  /**
   * Deterministically calculates the test score for the candidate based on 
   * the CandidateAnswer table, bypassing AI.
   */
  async calculateTestScore(assessmentId: string): Promise<number> {
    const stage = await prisma.assessmentStage.findFirst({
      where: { assessmentId, type: 'TEST' },
      include: { answers: { include: { question: true } } }
    })

    if (!stage || !stage.answers.length) return 0

    let correct = 0
    for (const ans of stage.answers) {
      if (ans.answer === ans.question.correctAnswer) {
        correct++
        // Update the database to reflect correct answer for analytics
        await prisma.candidateAnswer.update({
          where: { id: ans.id },
          data: { isCorrect: true, score: 1 }
        })
      }
    }

    const totalScore = correct
    const maxScore = stage.answers.length || 10

    await prisma.assessmentStage.update({
      where: { id: stage.id },
      data: { score: totalScore, maxScore }
    })

    return totalScore
  }

  /**
   * Calculates the final weighted score for the assessment and saves it to AssessmentResult.
   */
  async calculateFinalScore(assessmentId: string) {
    const stages = await prisma.assessmentStage.findMany({
      where: { assessmentId }
    })

    const scores = {
      TEST: { score: 0, maxScore: 10, weight: 10 },
      CASE: { score: 0, maxScore: 20, weight: 20 },
      SCRIPT: { score: 0, maxScore: 20, weight: 20 },
      LIVE_SALES: { score: 0, maxScore: 30, weight: 30 },
      VIDEO: { score: 0, maxScore: 20, weight: 20 }
    }

    for (const s of stages) {
      if (s.type in scores) {
        const type = s.type as keyof typeof scores
        scores[type].score = s.score || 0
        if (s.maxScore) scores[type].maxScore = s.maxScore
      }
    }

    // Default MVP Weights directly represent raw points out of 100
    const finalScore = 
      scores.TEST.score + 
      scores.CASE.score + 
      scores.SCRIPT.score + 
      scores.LIVE_SALES.score + 
      scores.VIDEO.score

    let recommendation: 'ADVANCE' | 'REVIEW' | 'REJECT' = 'REJECT'
    if (finalScore >= 90) recommendation = 'ADVANCE'
    else if (finalScore >= 75) recommendation = 'REVIEW'

    // Aggregate strengths and weaknesses from AI results
    const allStrengths: string[] = []
    const allWeaknesses: string[] = []
    
    // To get strengths/weaknesses, we need to inspect the AIResults
    const aiResults = await prisma.aIResult.findMany({
      where: {
        stage: { assessmentId },
        status: 'COMPLETED'
      },
      include: { stage: true }
    })

    for (const res of aiResults) {
      if (res.validatedResult && typeof res.validatedResult === 'object') {
        const validated = res.validatedResult as any
        if (Array.isArray(validated.strengths)) {
          allStrengths.push(...validated.strengths.map((s: string) => `[${res.stage.type}] ${s}`))
        }
        if (Array.isArray(validated.weaknesses)) {
          allWeaknesses.push(...validated.weaknesses.map((w: string) => `[${res.stage.type}] ${w}`))
        }
      }
    }

    const breakdownData = {
      test: { ...scores.TEST, percentage: scores.TEST.maxScore > 0 ? (scores.TEST.score / scores.TEST.maxScore) * 100 : 0 },
      case: { ...scores.CASE, percentage: scores.CASE.maxScore > 0 ? (scores.CASE.score / scores.CASE.maxScore) * 100 : 0 },
      script: { ...scores.SCRIPT, percentage: scores.SCRIPT.maxScore > 0 ? (scores.SCRIPT.score / scores.SCRIPT.maxScore) * 100 : 0 },
      simulation: { ...scores.LIVE_SALES, percentage: scores.LIVE_SALES.maxScore > 0 ? (scores.LIVE_SALES.score / scores.LIVE_SALES.maxScore) * 100 : 0 },
      video: { ...scores.VIDEO, percentage: scores.VIDEO.maxScore > 0 ? (scores.VIDEO.score / scores.VIDEO.maxScore) * 100 : 0 },
      total: finalScore
    }

    const existingResult = await prisma.assessmentResult.findFirst({
      where: { assessmentId }
    })

    const updateData = {
      testScore: scores.TEST.score,
      caseScore: scores.CASE.score,
      scriptScore: scores.SCRIPT.score,
      liveSalesScore: scores.LIVE_SALES.score,
      videoScore: scores.VIDEO.score,
      totalScore: finalScore,
      recommendation,
      strengths: allStrengths.join('\n'),
      weaknesses: allWeaknesses.join('\n'),
      data: breakdownData
    }

    if (existingResult) {
      await prisma.assessmentResult.update({
        where: { id: existingResult.id },
        data: updateData
      })
    } else {
      await prisma.assessmentResult.create({
        data: {
          assessmentId,
          ...updateData
        }
      })
    }

    // Update root assessment
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { totalScore: finalScore }
    })

    return finalScore
  }
}
