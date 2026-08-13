import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Standart weights — spesifikatsiya §17 ga mos (agar DB da konfiguratsiya bo'lmasa)
const DEFAULT_WEIGHTS = {
  CV:         { weight: 10, maxScore: 100 },
  TEST:       { weight: 15, maxScore: 10  },
  CASE:       { weight: 15, maxScore: 20  },
  SCRIPT:     { weight: 15, maxScore: 20  },
  LIVE_SALES: { weight: 30, maxScore: 30  },
  VIDEO:      { weight: 15, maxScore: 20  },
}

export class ScoringService {
  /**
   * Test ballini hisoblaydi — server-side, frontend dan manipulyatsiya bo'lmaydi.
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
   * Yakuniy weighted score hisoblaydi.
   * AssessmentStageConfig dan weights o'qiydi — agar yo'q bo'lsa DEFAULT_WEIGHTS ishlatiladi.
   */
  async calculateFinalScore(assessmentId: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        stages: true,
        stageConfigs: true,
      }
    })

    if (!assessment) throw new Error('Assessment not found')

    // DB dan weights o'qish — §17 talabi
    const configMap: Record<string, { weight: number; maxScore: number }> = {}
    for (const cfg of assessment.stageConfigs) {
      configMap[cfg.stageType] = { weight: cfg.weight, maxScore: cfg.maxScore }
    }

    // Stage ballarini yig'ish
    const stageScores: Record<string, { score: number; maxScore: number; weight: number }> = {}
    for (const s of assessment.stages) {
      const config = configMap[s.type] ?? DEFAULT_WEIGHTS[s.type as keyof typeof DEFAULT_WEIGHTS]
      if (!config) continue

      stageScores[s.type] = {
        score: s.score ?? 0,
        maxScore: s.maxScore ?? config.maxScore,
        weight: config.weight,
      }
    }

    // Weighted final score — har bir bosqich o'z weightiga ko'ra hisoblanadi
    // Formula: sum( (stage_score / stage_maxScore) * stage_weight )
    let finalScore = 0
    for (const [, val] of Object.entries(stageScores)) {
      if (val.maxScore > 0) {
        finalScore += (val.score / val.maxScore) * val.weight
      }
    }
    finalScore = Math.min(100, Math.round(finalScore * 10) / 10)

    // Recommendation — spesifikatsiya §20 ga mos
    let recommendation: 'ADVANCE' | 'REVIEW' | 'REJECT' = 'REJECT'
    if (finalScore >= 85) recommendation = 'ADVANCE'
    else if (finalScore >= 65) recommendation = 'REVIEW'

    // AI result lardan strengths va weaknesses yig'ish
    const allStrengths: string[] = []
    const allWeaknesses: string[] = []

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

    // Breakdown — har bir bosqich uchun batafsil ma'lumot
    const breakdownData = {
      cv:         stageScores['CV'],
      test:       stageScores['TEST'],
      case:       stageScores['CASE'],
      script:     stageScores['SCRIPT'],
      simulation: stageScores['LIVE_SALES'],
      video:      stageScores['VIDEO'],
      total:      finalScore,
    }

    const existingResult = await prisma.assessmentResult.findFirst({
      where: { assessmentId }
    })

    const updateData = {
      cvScore:       stageScores['CV']?.score ?? null,
      testScore:     stageScores['TEST']?.score ?? null,
      caseScore:     stageScores['CASE']?.score ?? null,
      scriptScore:   stageScores['SCRIPT']?.score ?? null,
      liveSalesScore: stageScores['LIVE_SALES']?.score ?? null,
      videoScore:    stageScores['VIDEO']?.score ?? null,
      totalScore:    finalScore,
      recommendation,
      strengths:     allStrengths.join('\n'),
      weaknesses:    allWeaknesses.join('\n'),
      data:          breakdownData,
    }

    if (existingResult) {
      await prisma.assessmentResult.update({
        where: { id: existingResult.id },
        data: updateData
      })
    } else {
      await prisma.assessmentResult.create({
        data: { assessmentId, ...updateData }
      })
    }

    // Assessment umumiy scoreni yangilash
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { totalScore: finalScore }
    })

    return finalScore
  }
}
