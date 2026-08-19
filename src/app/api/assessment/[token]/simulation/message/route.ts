import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { getGeminiClient, getTextModel, isMockMode } from '@/lib/ai/gemini/client'
import { rateLimit } from '@/lib/security/rateLimit'

const CUSTOMER_PERSONA = `Sen bir AI mijozsan. Quyidagi rolni to'liq bajarasan:

ROL: Mebel do'koni xaridor
MAHSULOT: Yotoqxona va oshxona mebelini qidirmoqda
BYUDJET: 25 million so'm atrofida
ASOSIY MUAMMO: Narx va sifat (yashirin)

MUHIM QOIDALAR:
1. Har doim mijoz rolida qol — hech qachon roldan chiqma
2. Realistik e'tirozlar ko'tar: narx qimmatligi, o'ylab ko'rish kerakligi
3. Tabiiy suhbatdosh bo'l va o'zbek tilida 2-3 jumladan oshirmay javob ber.`

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

    // Rate limiting — har 10 soniyada max 10 ta xabar
    const rateLimitKey = `simulation:${token}`
    if (!rateLimit(rateLimitKey, 10, 10_000)) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Juda tez xabar yuborilmoqda. Iltimos, biroz kuting.' } },
        { status: 429 }
      )
    }

    const assessment = await AssessmentService.getAssessmentByToken(token)
    if (!assessment) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Assessment not found.' } }, { status: 404 })
    }

    const body = await request.json()
    const { message, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Message is required.' } }, { status: 400 })
    }

    // Mock rejim yoki Fallback
    if (isMockMode()) {
      const aiResponse = getMockResponse(message, history?.length ?? 0)
      return NextResponse.json({ data: { response: aiResponse } })
    }

    // Real Gemini API Call with Graceful Fallback
    try {
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
          temperature: 0.8,
        }
      })

      const aiResponse = response.text?.trim()
      if (aiResponse) {
        return NextResponse.json({ data: { response: aiResponse } })
      }
    } catch (geminiError: any) {
      console.warn('[Gemini Call Warning - Fallback used]:', geminiError.message)
    }

    // Fallback response if Gemini API has quota/model issue
    const fallbackResponse = getMockResponse(message, history?.length ?? 0)
    return NextResponse.json({ data: { response: fallbackResponse } })

  } catch (e: unknown) {
    const error = e as any
    console.error('[Simulation Message Error]:', error.message)
    return NextResponse.json(
      { data: { response: "Tushunarli. Lekin narxi va kafolati haqida batafsilroq aytib bera olasizmi?" } },
      { status: 200 }
    )
  }
}

function getMockResponse(message: string, historyLength: number): string {
  if (historyLength === 0) {
    return "Assalomu alaykum! Mebellar do'koniga xush kelibsiz. Mening ismim Madina. Sizga qaysi turdagi mebelimiz qiziq bo'ldi?"
  }
  const lower = message.toLowerCase()
  if (lower.includes('salom') || lower.includes('assalom')) {
    return "Vaalaykum assalom! Yotoqxona uchun sifatli va zamonaviy mebel qidirayotgandim."
  }
  if (lower.includes('xona') || lower.includes('o\'lcham') || lower.includes('dizayn')) {
    return "Zamonaviy uslubda, sifatli materialdan bo'lishi kerak. Lekin narxi biroz qimmat emasmi?"
  }
  if (lower.includes('narx') || lower.includes('qimmat') || lower.includes('mdf')) {
    return "Tushunarli... Lekin o'ylab ko'rishim kerak. Uydegilar bilan ham maslahatlashay-chi."
  }
  if (lower.includes('o\'ylab') || lower.includes('maslahat') || lower.includes('telegram')) {
    return "Bo'ladi, Telegram orqali barcha rasmlarini yuboring. Bepul o'lchab berish xizmatigiz bormi?"
  }
  if (lower.includes('o\'lchash') || lower.includes('bepul') || lower.includes('dostavka')) {
    return "Juda yaxshi! Unda shanba kuni ustangiz kelib joyini o'lchab ketsin."
  }
  return "Tushundim. Yana qanday imkoniyat va afzalliklaringiz bor?"
}
