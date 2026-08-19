'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { AssessmentStageType } from '@prisma/client'
import { SalesPhoneCallSimulation } from '@/components/candidate/SalesPhoneCallSimulation'

export default function SimulationPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    params.then(p => {
      setToken(p.token)
    })
  }, [params])

  useEffect(() => {
    if (!token) return
    fetch(`/api/assessment/${token}`)
      .then(res => res.json())
      .then(res => {
        if (res.data?.assessment) {
          setProgress({
            currentStage: res.data.assessment.currentStage,
            completedStages: res.data.assessment.completedStages
          })
        }
      })
  }, [token])

  const handleCallSimulationComplete = async (score: number) => {
    try {
      await fetch(`/api/assessment/${token}/simulation/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: `Call simulation completed with score: ${score}` })
      })
      router.push(`/assessment/${token}/video`)
    } catch (e) {
      router.push(`/assessment/${token}/video`)
    }
  }

  if (!token || !progress) return null

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.LIVE_SALES} completedStages={progress.completedStages} />
      <StageHeader
        title="📞 Ovozli AI Sotuv Simulyatsiyasi (Gemini AI Phone Call)"
        description="Mijoz (Madina) bilan telefon orqali muloqot qilib, 5 bosqichli sotuv skripti bo'yicha mahsulotni soting."
      />

      <SalesPhoneCallSimulation
        productName="Mebellar do'koni to'plamlari"
        onComplete={handleCallSimulationComplete}
      />
    </AssessmentLayout>
  )
}
