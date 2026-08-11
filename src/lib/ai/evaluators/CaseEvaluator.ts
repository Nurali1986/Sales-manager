import { IAIEvaluator, EvaluatorInput } from './types'
import { EvaluationResult, evaluationSchema } from '../gemini/schemas'
import { getGeminiClient, isMockMode, getTextModel } from '../gemini/client'

export class CaseEvaluator implements IAIEvaluator {
  private getPrompt(input: EvaluatorInput): string {
    return `
You are an expert Sales Recruitment AI evaluator.
Evaluate the candidate's response to the Sales Case scenario.

### Context
Job Context: ${input.jobContext}

### Candidate's Case Submission
${input.content}

### Evaluation Rubric (Total 20 points)
1. Needs Discovery (Max 5 points): Does the candidate attempt to understand the customer's real need, budget, and timeline?
2. Customer Understanding (Max 5 points): Do they listen and adapt to the customer?
3. Objection Handling (Max 5 points): Do they handle "too expensive" effectively without instantly dropping the price?
4. Sales Logic (Max 5 points): Do they follow a logical process from qualification to next steps?

Evaluate only job-relevant skills. Do not infer protected characteristics.
If evidence is insufficient, mark it as insufficient evidence.
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
      score: 16,
      criteria: [
        { name: "Needs Discovery", score: 4, maxScore: 5, evidence: "Asked good questions about budget." },
        { name: "Customer Understanding", score: 4, maxScore: 5, evidence: "Showed empathy for the customer's situation." },
        { name: "Objection Handling", score: 4, maxScore: 5, evidence: "Handled price well without instant discount." },
        { name: "Sales Logic", score: 4, maxScore: 5, evidence: "Followed basic structure." }
      ],
      strengths: ["Strong value proposition", "Professional tone"],
      weaknesses: ["Needs deeper diagnostic questioning"],
      recommendation: "ADVANCE",
      summary: "A solid sales case response demonstrating good understanding.",
      confidence: 90
    }
  }
}
