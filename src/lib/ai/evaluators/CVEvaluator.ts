import { IAIEvaluator, EvaluatorInput } from './types'
import { EvaluationResult, evaluationSchema } from '../gemini/schemas'
import { getGeminiClient, isMockMode, getTextModel } from '../gemini/client'

export class CVEvaluator implements IAIEvaluator {
  private getPrompt(input: EvaluatorInput): string {
    return `
You are an expert Sales Recruitment AI evaluator.
Evaluate the candidate's CV metadata and content.

### Context
Job Context: ${input.jobContext}

### Candidate CV Content/Metadata
${input.content}

### Evaluation Rubric (Total 100 points)
Evaluate based on:
- Relevant sales experience
- Industry experience
- B2B/B2C experience
- Leadership experience
- Measurable sales achievements
- Tenure / stability
- Relevant skills

Do NOT score age, gender, ethnicity, religion, nationality, appearance, disability, marital status, or other protected characteristics.
If information is missing, state "Not enough evidence". Do not guess.
Respond purely in JSON matching the requested schema.
`
  }

  async evaluate(input: EvaluatorInput): Promise<EvaluationResult> {
    if (isMockMode()) {
      return this.mockEvaluate(input)
    }

    const client = getGeminiClient()
    const response = await client.models.generateContent({
      model: getTextModel(),
      contents: this.getPrompt(input),
      config: {
        responseMimeType: 'application/json',
      }
    })

    const text = response.text
    if (!text) throw new Error('No text returned from Gemini')

    const parsed = JSON.parse(text)
    return evaluationSchema.parse(parsed)
  }

  async mockEvaluate(input: EvaluatorInput): Promise<EvaluationResult> {
    return {
      score: 70,
      criteria: [
        { name: "Sales Experience", score: 70, maxScore: 100, evidence: "Has 3 years B2B sales." }
      ],
      strengths: ["Relevant industry experience"],
      weaknesses: ["No leadership roles"],
      recommendation: "ADVANCE",
      summary: "Solid CV but lacks senior experience.",
      confidence: 80
    }
  }
}
