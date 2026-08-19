'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { AssessmentStageType } from '@prisma/client'
import { SalesScriptBuilderStage } from '@/components/candidate/SalesScriptBuilderStage'

export default function ScriptPage({ params }: { params: Promise<{ token: string }> }) {
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

  const handleScriptSubmit = async (scriptContent: string) => {
    try {
      await fetch(`/api/assessment/${token}/script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: scriptContent })
      })
      router.push(`/assessment/${token}/simulation`)
    } catch (e) {
      router.push(`/assessment/${token}/simulation`)
    }
  }

  if (!token || !progress) return null

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.SCRIPT} completedStages={progress?.completedStages || []} />
      <StageHeader
        title="📜 Sotuv Skriptini Yaratish (5 Bosqichli Skript Builder)"
        description="Sotuv bo'limi boshlig'i sifatida 5 bosqichdan iborat sotuv skriptini platformada yozib topshiring."
      />

      <SalesScriptBuilderStage
        onSubmitScript={handleScriptSubmit}
      />
    </AssessmentLayout>
  )
}
