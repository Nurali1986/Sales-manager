import { NextResponse } from 'next/server'
import { AssessmentService } from '@/services/assessment.service'
import { AssessmentStageService } from '@/services/assessmentStage.service'
import { AssessmentStageType } from '@prisma/client'

// In a real implementation, this would call the Gemini API.
// For MVP, we provide a mock AI persona response based on the candidate's message.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const assessment = await AssessmentService.getAssessmentByToken(token)
    
    if (!AssessmentStageService.canAccessStage(assessment.stages, AssessmentStageType.LIVE_SALES)) {
      return NextResponse.json({ error: { code: 'INVALID_STAGE', message: 'Cannot access this stage.' } }, { status: 400 })
    }

    const simStage = assessment.stages.find(s => s.type === AssessmentStageType.LIVE_SALES)
    if (!simStage || simStage.status === 'COMPLETED') {
      return NextResponse.json({ error: { code: 'INVALID_STATE', message: 'Stage not active.' } }, { status: 400 })
    }

    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Message is required.' } }, { status: 400 })
    }

    // Mock AI Logic
    let aiResponse = ''
    const lowerMessage = message.toLowerCase()
    
    if (history.length === 0) {
      aiResponse = "Assalomu alaykum. Men ofisimiz uchun yangi mebellar qidirayotgan edim. Mahsulotlaringiz haqida ma'lumot bersangiz?"
    } else if (lowerMessage.includes('narx') || lowerMessage.includes('qimmat')) {
      aiResponse = "Rostini aytsam, boshqa joylarda xuddi shunday mebellarni arzonroq ko'rdim. Nega sizlarda narx balandroq?"
    } else if (lowerMessage.includes('sifat') || lowerMessage.includes('kafolat')) {
      aiResponse = "Tushunarli, sifati yaxshi deyapsiz. Lekin baribir byudjetimiz chegaralangan. Qandaydir chegirma qilib bera olasizmi?"
    } else if (lowerMessage.includes('chegirma') || lowerMessage.includes('bonus')) {
      aiResponse = "Yaxshi taklif ekan. Unda menga umumiy hisob-kitobni yuborsangiz, rahbariyat bilan maslahatlashib ko'raman."
    } else {
      aiResponse = "Tushunarli... Yana qanday afzalliklaringiz bor?"
    }

    // Add a slight artificial delay to simulate API processing
    await new Promise(resolve => setTimeout(resolve, 800))

    return NextResponse.json({ data: { response: aiResponse } })
  } catch (e: unknown) {
    const error = e as any
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: error.message || 'An internal error occurred.' } }, { status: 500 })
  }
}
