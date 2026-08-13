import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { getGeminiClient, getTextModel, isMockMode } from '@/lib/ai/gemini/client'
import { AssessmentStageType } from '@prisma/client'
import { rateLimit } from '@/lib/security/rateLimit'

// AI Customer persona — spesifikatsiya §12 ga mos
const CUSTOMER_PERSONA = `Sen bir AI mijozsan. Quyidagi rolni to'liq bajarasan:

ROL: Mebel do'koni xaridor
MAHSULOT: Oshxona mebelini qidirmoqda
BYUDJET: 25 million so'm atrofida (lekin bu ma'lumotni darhol aytma)
ASOSIY EHTIYOJ: Oshxona ta'mirlash uchun mebel
ASOSIY MUAMMO: Narx (yashirin)
QAROR QABUL QILUVCHI: Sen o'zing, lekin eri bilan maslahatlashishi mumkin
YASHIRIN MA'LUMOT: 2 raqobatchi kompaniya bilan ham gaplashmoqda

MUHIM QOIDALAR:
1. Har doim mijoz rolida qol — hech qachon roldan chiqma
2. Ma'lumotlarni asta-sekin ber — faqat to'g'ri savol berilganida
3. Realistik e'tirozlar ko'tar: narx, sifat, kafolat, yetkazib berish, o'ylash kerakligi
4. Sales managerga coaching berma — bu imtihon ekanini aytma
5. Tabiiy suhbatdosh bo'l
6. O'zbek tilida yoki rus tilida javob ber (nomzod qaysi tilda gaplashsa)
7. 2-3 jumladan oshirma`

const SYSTEM_PROMPT = `${CUSTOMER_PERSONA}

Suhbat tarixi: {HISTORY}

Nomzodning oxirgi xabari: {MESSAGE}

Javob ber:`

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // Rate limiting — har 10 soniyada max 5 ta xabar
    const rateLimitKey = `simulation:${token}`
    if (!rateLimit(rateLimitKey, 5, 10_000)) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Juda tez xabar yuborilmoqda. Iltimos, biroz kuting.' } },
        { status: 429 }
      )
    }

    const assessment = await AssessmentService.getAssessmentByToken(token)

    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.LIVE_SALES)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const simStage = assessment.stages.find(s => s.type === AssessmentStageType.LIVE_SALES)
    if (!simStage || simStage.status === 'COMPLETED') {
      return NextResponse.json({ error: { code: 'INVALID_STATE', message: 'Stage not active.' } }, { status: 400 })
    }

    const body = await request.json()
    const { message, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Message is required.' } }, { status: 400 })
    }

    // Mock rejim
    if (isMockMode()) {
      const aiResponse = getMockResponse(message, history?.length ?? 0)
      return NextResponse.json({ data: { response: aiResponse } })
    }

    // Real Gemini API
    const historyText = Array.isArray(history) && history.length > 0
      ? history.map((m: { sender: string; text: string }) => `${m.sender === 'AI' ? 'Mijoz' : 'Sales Manager'}: ${m.text}`).join('\n')
      : 'Suhbat hali boshlanmagan.'

    const prompt = SYSTEM_PROMPT
      .replace('{HISTORY}', historyText)
      .replace('{MESSAGE}', message)

    const client = getGeminiClient()
    const response = await client.models.generateContent({
      model: getTextModel(),
      contents: prompt,
      config: {
        maxOutputTokens: 150,
        temperature: 0.85,
      }
    })

    const aiResponse = response.text?.trim()
    if (!aiResponse) {
      throw new Error('Gemini bo\'sh javob qaytardi')
    }

    return NextResponse.json({ data: { response: aiResponse } })
  } catch (e: unknown) {
    const error = e as any
    console.error('[Simulation Message] Error:', error.message)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Javob olishda xatolik yuz berdi. Qaytadan urinib ko\'ring.' } },
      { status: 500 }
    )
  }
}

// Mock rejim uchun — faqat AI_EVALUATION_MODE=mock bo'lganda ishlatiladi
function getMockResponse(message: string, historyLength: number): string {
  if (historyLength === 0) {
    return "Assalomu alaykum. Men oshxonam uchun mebel qidiryapman. Sizda nima bor?"
  }
  const lower = message.toLowerCase()
  if (lower.includes('narx') || lower.includes('qancha')) {
    return "Ha, narx muhim. Lekin sifat ham kerak. Qanday materialdan yasalgan?"
  }
  if (lower.includes('sifat') || lower.includes('material')) {
    return "Kafolat necha yil berasiz? Va yetkazib berish bor ekanmi?"
  }
  if (lower.includes('kafolat') || lower.includes('yetkazib')) {
    return "Tushundi... Boshqa joylarda ham ko'rganman. O'ylashim kerak."
  }
  if (lower.includes('chegirma') || lower.includes('skidka')) {
    return "Chegirma bo'lsa yaxshi bo'lardi. Lekin erim bilan ham maslahatlashishim kerak."
  }
  return "Tushundim... Yana qanday imkoniyatlar bor?"
}
