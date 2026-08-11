import { IAIEvaluator, EvaluatorInput } from './types'
import { EvaluationResult, evaluationSchema } from '../gemini/schemas'
import { getGeminiClient, isMockMode, getMultimodalModel } from '../gemini/client'

export class VideoEvaluator implements IAIEvaluator {
  private getPrompt(input: EvaluatorInput): string {
    return `
You are an expert Sales Recruitment AI evaluator.
Evaluate the candidate's 60-second video pitch.

### Context
Job Context: ${input.jobContext}

### Candidate's Video Metadata
Storage Key: ${input.content}
(Note: Assume you have analyzed this video for the following criteria).

### Evaluation Rubric (Total 20 points)
1. Opening / Hook (Max 4 points): Captures attention quickly?
2. Value Proposition (Max 5 points): Clearly explains why the customer should buy?
3. Customer Benefit (Max 4 points): Speaks about customer needs rather than only company features?
4. Persuasiveness (Max 4 points): Creates convincing reasons to buy?
5. Closing / CTA (Max 3 points): Asks for a next step?

Evaluate only spoken content, sales reasoning, clarity, persuasion, communication, and structure.
Do NOT score physical appearance, attractiveness, ethnicity, gender, age, clothing brand, background, or socioeconomic indicators.
Do NOT infer personality or protected characteristics.
If evidence is insufficient, mark it as insufficient evidence.
Respond purely in JSON matching the requested schema.
`
  }

  async evaluate(input: EvaluatorInput): Promise<EvaluationResult> {
    if (isMockMode()) {
      return this.mockEvaluate(input)
    }

    // In a real implementation:
    // 1. Download video from MinIO/S3 using input.content (storageKey)
    // 2. Upload video to Gemini File API (client.files.upload)
    // 3. Pass the URI to generateContent

    const client = getGeminiClient()
    const response = await client.models.generateContent({
      model: getMultimodalModel(),
      contents: this.getPrompt(input), // In production, add the uploaded video file part here
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
      score: 18,
      criteria: [
        { name: "Opening / Hook", score: 4, maxScore: 4, evidence: "Strong confident opening." },
        { name: "Value Proposition", score: 4, maxScore: 5, evidence: "Clearly articulated." },
        { name: "Customer Benefit", score: 4, maxScore: 4, evidence: "Focused on solving customer pain." },
        { name: "Persuasiveness", score: 3, maxScore: 4, evidence: "Good logic." },
        { name: "Closing / CTA", score: 3, maxScore: 3, evidence: "Clear CTA." }
      ],
      strengths: ["Confident delivery"],
      weaknesses: ["Slightly rushed"],
      recommendation: "ADVANCE",
      summary: "Excellent video pitch.",
      confidence: 95
    }
  }
}
