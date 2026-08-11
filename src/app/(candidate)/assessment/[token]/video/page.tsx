'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { CameraRecorder } from '@/components/candidate/CameraRecorder'
import { AssessmentStageType } from '@prisma/client'

export default function VideoPage({ params }: { params: Promise<{ token: string }> }) {
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
      <AssessmentProgress currentStage={AssessmentStageType.VIDEO} completedStages={progress.completedStages} />
      <StageHeader title="Video Presentation" description="Record a 60-second video." />

      <div style={{ backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', lineHeight: '1.6' }}>
        <strong>Task:</strong>
        <p>Tasavvur qiling, siz bizning mebel ishlab chiqarish fabrikamizning Sales Managerisiz.</p>
        <p>60 soniya ichida mijozga nima uchun aynan bizning fabrikamizdan mebel sotib olishi kerakligini tushuntiring.</p>
        <p>O'zingizni haqiqiy mijoz oldida turgandek tasavvur qiling.</p>
      </div>

      <CameraRecorder 
        token={token} 
        onUploadSuccess={() => {
          router.push(`/assessment/${token}/completed`)
        }}
      />
    </AssessmentLayout>
  )
}
