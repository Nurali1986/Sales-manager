import { IAIEvaluator, EvaluatorInput } from './types'
import { EvaluationResult, evaluationSchema } from '../gemini/schemas'
import { getGeminiClient, isMockMode, getTextModel } from '../gemini/client'

export class SimulationEvaluator implements IAIEvaluator {
  private getPrompt(input: EvaluatorInput): string {
    return `
You are an expert Sales Recruitment AI evaluator.
Evaluate the candidate's mock AI customer simulation conversation.

### Context
Job Context: ${input.jobContext}

### Conversation Transcript
${input.content}

### Evaluation Rubric (Total 30 points)
1. Opening & Rapport (Max 5 points): Did the candidate build rapport?
2. Needs Discovery (Max 7 points): Did they uncover the customer's core needs?
3. Question Quality (Max 5 points): Did they ask strong, diagnostic questions?
4. Objection Handling (Max 5 points): Did they handle objections without folding immediately?
5. Value Proposition (Max 4 points): Did they communicate value over price?
6. Closing / Next Step (Max 4 points): Did they move toward a concrete next step?

IMPORTANT: Distinguish clearly between "AI CUSTOMER" and "CANDIDATE". Only the "CANDIDATE" messages contribute positive or negative evidence. Never score the customer's statements as candidate behavior.
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
      score: 24,
      criteria: [
        { name: "Opening & Rapport", score: 4, maxScore: 5, evidence: "Friendly and professional opening." },
        { name: "Needs Discovery", score: 6, maxScore: 7, evidence: "Asked relevant questions." },
        { name: "Question Quality", score: 4, maxScore: 5, evidence: "Asked open-ended questions." },
        { name: "Objection Handling", score: 4, maxScore: 5, evidence: "Handled price objection." },
        { name: "Value Proposition", score: 3, maxScore: 4, evidence: "Good value match." },
        { name: "Closing / Next Step", score: 3, maxScore: 4, evidence: "Proposed a meeting." }
      ],
      strengths: ["Active listening"],
      weaknesses: ["Slightly aggressive closing"],
      recommendation: "ADVANCE",
      summary: "Strong interactive sales skills.",
      confidence: 90
    }
  }
}
