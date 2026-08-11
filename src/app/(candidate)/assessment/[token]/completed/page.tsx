'use client'

import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'

import { useEffect, useState } from 'react'

export default function CompletedPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    params.then(p => {
      setToken(p.token)
    })
  }, [params])

  useEffect(() => {
    if (!token) return
    
    // Call the complete API to move to PROCESSING
    fetch(`/api/assessment/${token}/complete`, { method: 'POST' })
      .then(res => res.json())
      .then(() => setCompleted(true))
      .catch(console.error)
  }, [token])

  return (
    <AssessmentLayout>
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', 
          backgroundColor: 'var(--success)', color: 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2rem', margin: '0 auto 1.5rem' 
        }}>
          ✓
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Assessment Completed!</h1>
        
        <p style={{ fontSize: '1.125rem', color: 'var(--muted-text)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Thank you for completing the Sales Manager assessment. Your responses have been submitted successfully.
        </p>
        <br />
        <p style={{ color: 'var(--muted-text)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          The recruitment team will review your application and contact you if you are selected for the next stage.
        </p>
      </div>
    </AssessmentLayout>
  )
}
