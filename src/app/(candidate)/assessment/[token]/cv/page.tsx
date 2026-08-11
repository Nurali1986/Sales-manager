'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { FileUpload } from '@/components/candidate/FileUpload'
import { AssessmentStageType } from '@prisma/client'

export default function CVPage({ params }: { params: Promise<{ token: string }> }) {
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

  if (!token || !progress) return null

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.CV} completedStages={progress.completedStages} />
      <StageHeader title="Upload Resume / CV" description="Please upload your latest CV in PDF or DOCX format." />
      
      <FileUpload 
        token={token} 
        onUploadSuccess={() => {
          router.push(`/assessment/${token}/test`)
        }} 
      />
    </AssessmentLayout>
  )
}
