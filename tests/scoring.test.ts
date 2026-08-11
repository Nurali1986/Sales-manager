import { describe, it, expect, vi } from 'vitest'
import { ScoringService } from '../src/lib/ai/ScoringService'

// Mock Prisma
const mockPrisma = vi.hoisted(() => ({
  assessmentStage: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  candidateAnswer: {
    update: vi.fn(),
  },
  assessmentResult: {
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  assessment: {
    update: vi.fn(),
  },
  aIResult: {
    findMany: vi.fn(),
  }
}))

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      assessmentStage = mockPrisma.assessmentStage
      candidateAnswer = mockPrisma.candidateAnswer
      assessmentResult = mockPrisma.assessmentResult
      assessment = mockPrisma.assessment
      aIResult = mockPrisma.aIResult
    }
  }
})

describe('ScoringService', () => {
  const scoringService = new ScoringService()

  it('calculates deterministic test score (8/10 = 8)', async () => {
    mockPrisma.assessmentStage.findFirst.mockResolvedValueOnce({
      id: 'stage-1',
      answers: [
        { id: 'a1', answer: 'A', question: { correctAnswer: 'A' } },
        { id: 'a2', answer: 'B', question: { correctAnswer: 'B' } },
        { id: 'a3', answer: 'C', question: { correctAnswer: 'C' } },
        { id: 'a4', answer: 'D', question: { correctAnswer: 'D' } },
        { id: 'a5', answer: 'A', question: { correctAnswer: 'A' } },
        { id: 'a6', answer: 'B', question: { correctAnswer: 'B' } },
        { id: 'a7', answer: 'C', question: { correctAnswer: 'C' } },
        { id: 'a8', answer: 'D', question: { correctAnswer: 'D' } },
        { id: 'a9', answer: 'WRONG', question: { correctAnswer: 'A' } },
        { id: 'a10', answer: 'WRONG', question: { correctAnswer: 'B' } },
      ]
    })

    const score = await scoringService.calculateTestScore('assessment-id')
    expect(score).toBe(8)
    expect(mockPrisma.candidateAnswer.update).toHaveBeenCalledTimes(8)
  })

  it('calculates weighted final score correctly', async () => {
    mockPrisma.assessmentStage.findMany.mockResolvedValueOnce([
      { type: 'TEST', score: 8, maxScore: 10 },
      { type: 'CASE', score: 16, maxScore: 20 },
      { type: 'SCRIPT', score: 17, maxScore: 20 },
      { type: 'LIVE_SALES', score: 24, maxScore: 30 },
      { type: 'VIDEO', score: 18, maxScore: 20 },
    ])
    mockPrisma.assessmentResult.findFirst.mockResolvedValueOnce(null)
    mockPrisma.aIResult.findMany.mockResolvedValueOnce([])

    const finalScore = await scoringService.calculateFinalScore('assessment-id')
    
    const expected = 8 + 16 + 17 + 24 + 18
    expect(finalScore).toBe(expected)
  })
})
