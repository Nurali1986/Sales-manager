import { EvaluationResult } from '../gemini/schemas'

export interface EvaluatorInput {
  assessmentId: string
  candidateId: string
  jobContext: string
  content: string // Text content or storage key for video/cv
}

export interface IAIEvaluator {
  evaluate(input: EvaluatorInput): Promise<EvaluationResult>
  mockEvaluate(input: EvaluatorInput): Promise<EvaluationResult>
}
