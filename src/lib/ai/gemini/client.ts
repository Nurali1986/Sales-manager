import { GoogleGenAI } from '@google/genai'

let client: GoogleGenAI | null = null

export function getGeminiClient(): GoogleGenAI {
  if (client) return client

  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing. AI evaluations will fail unless AI_EVALUATION_MODE is set to mock.')
  }

  client = new GoogleGenAI({ apiKey: apiKey || 'mock-key' })
  return client
}

export function isMockMode(): boolean {
  return process.env.AI_EVALUATION_MODE === 'mock'
}

export function getTextModel(): string {
  return process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-pro'
}

export function getMultimodalModel(): string {
  return process.env.GEMINI_LIVE_MODEL || 'gemini-1.5-pro' // Using LIVE_MODEL env as multimodal fallback for now
}
