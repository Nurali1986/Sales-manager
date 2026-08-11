import { describe, it, expect } from 'vitest'
import { evaluationSchema } from '../src/lib/ai/gemini/schemas'

describe('AI Zod Schemas', () => {
  it('validates a correct AI JSON output', () => {
    const validData = {
      score: 85,
      criteria: [
        { name: 'Need Discovery', score: 18, maxScore: 20, evidence: 'Asked questions' }
      ],
      strengths: ['Good communication'],
      weaknesses: ['Missed timeline'],
      recommendation: 'ADVANCE',
      summary: 'Solid performance',
      confidence: 90
    }

    const result = evaluationSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects output with missing criteria evidence', () => {
    const invalidData = {
      score: 85,
      criteria: [
        { name: 'Need Discovery', score: 18, maxScore: 20 } // Missing evidence
      ],
      strengths: ['Good communication'],
      weaknesses: ['Missed timeline'],
      recommendation: 'ADVANCE',
      summary: 'Solid performance',
      confidence: 90
    }

    const result = evaluationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('rejects output with score > 100', () => {
    const invalidData = {
      score: 105,
      criteria: [],
      strengths: [],
      weaknesses: [],
      recommendation: 'ADVANCE',
      summary: 'Solid performance',
      confidence: 90
    }

    const result = evaluationSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
