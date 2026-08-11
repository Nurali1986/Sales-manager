import { IAIEvaluator, EvaluatorInput } from './types'
import { EvaluationResult, evaluationSchema } from '../gemini/schemas'
import { getGeminiClient, isMockMode, getTextModel } from '../gemini/client'

export class ScriptEvaluator implements IAIEvaluator {
  private getPrompt(input: EvaluatorInput): string {
    return `
You are an expert Sales Recruitment AI evaluator.
Evaluate the candidate's sales cold-call script.

### Context
Job Context: ${input.jobContext}

### Candidate's Script Submission
${input.content}

### Evaluation Rubric (Total 20 points)
1. Opening (Max 4 points): Professional introduction and reason for the call.
2. Needs Discovery (Max 4 points): Questions that uncover customer's needs.
3. Value Proposition (Max 4 points): Connects product benefits to customer needs.
4. Objection Handling (Max 4 points): Handles objections effectively.
5. Closing / CTA (Max 4 points): Clear next action and closing.

Evaluate whether the script could realistically be used by a Sales Manager. Do not reward generic phrases simply because they sound professional.
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
      score: 17,
      criteria: [
        { name: "Opening", score: 4, maxScore: 4, evidence: "Good intro." },
        { name: "Needs Discovery", score: 3, maxScore: 4, evidence: "Basic questions asked." },
        { name: "Value Proposition", score: 4, maxScore: 4, evidence: "Generic value mentioned." },
        { name: "Objection Handling", score: 3, maxScore: 4, evidence: "Okay response." },
        { name: "Closing / CTA", score: 3, maxScore: 4, evidence: "Vague next steps." }
      ],
      strengths: ["Friendly intro"],
      weaknesses: ["Vague CTA"],
      recommendation: "ADVANCE",
      summary: "Acceptable script but lacks strong closing.",
      confidence: 85
    }
  }
}
