'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'

export default function AssessmentGuardPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    params.then(p => {
      setToken(p.token)
    })
  }, [params])

  useEffect(() => {
    if (!token) return

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/assessment/${token}`)
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error?.message || 'Failed to load assessment')
          return
        }

        const { currentStage } = data.data.assessment
        
        if (currentStage === 'COMPLETED') {
          router.replace(`/assessment/${token}/completed`)
          return
        }

        const stageToPath: Record<string, string> = {
          'PROFILE': 'profile',
          'CV': 'cv',
          'TEST': 'test',
          'CASE': 'case',
          'SCRIPT': 'script',
          'LIVE_SALES': 'simulation',
          'VIDEO': 'video'
        }

        // Always redirect them to their active stage (or welcome if profile is first and not started)
        const path = stageToPath[currentStage as string]
        if (path) {
           // We will send everyone to welcome first, and welcome redirects to profile. 
           // But actually let's just go directly to the stage.
           if (currentStage === 'PROFILE') {
             router.replace(`/assessment/${token}/welcome`)
           } else {
             router.replace(`/assessment/${token}/${path}`)
           }
        }
      } catch (err) {
        setError('An error occurred loading the assessment.')
      }
    }

    checkStatus()
  }, [token, router])

  return (
    <AssessmentLayout>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {error ? (
          <h2 style={{ color: 'var(--danger)' }}>{error}</h2>
        ) : (
          <p>Loading your assessment...</p>
        )}
      </div>
    </AssessmentLayout>
  )
}
