import { z } from 'zod'

// The core schema for evaluating a single criterion
export const criterionSchema = z.object({
  name: z.string().describe('Name of the criterion being evaluated.'),
  score: z.number().min(0).max(100).describe('Score for this criterion from 0 to maxScore.'),
  maxScore: z.number().describe('The maximum possible score for this specific criterion.'),
  evidence: z.string().describe('Specific quotes or evidence from the candidate\'s submission. If insufficient evidence, explicitly state so.')
})

export type CriterionEvaluation = z.infer<typeof criterionSchema>

// The overall evaluation result schema expected from the LLM
export const evaluationSchema = z.object({
  score: z.number().min(0).max(100).describe('Overall sum of criteria scores for this stage.'),
  criteria: z.array(criterionSchema).describe('Detailed breakdown of each criterion evaluated.'),
  strengths: z.array(z.string()).describe('List of 1 to 3 key strengths demonstrated by the candidate in this submission.'),
  weaknesses: z.array(z.string()).describe('List of 1 to 3 key weaknesses or areas for improvement.'),
  recommendation: z.enum(['ADVANCE', 'REVIEW', 'REJECT']).describe('Overall recommendation based on this specific evaluation stage.'),
  summary: z.string().describe('A brief overall summary of the candidate\'s performance in this stage.'),
  confidence: z.number().min(0).max(100).describe('Your confidence score in this evaluation from 0 to 100.')
})

export type EvaluationResult = z.infer<typeof evaluationSchema>
