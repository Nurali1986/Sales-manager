'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { PrimaryButton } from '@/components/candidate/Button'
import { AssessmentStageType } from '@prisma/client'

export default function ProfilePage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [progress, setProgress] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    try {
      const res = await fetch(`/api/assessment/${token}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (data.error?.code === 'VALIDATION_ERROR') {
          setErrors({ general: data.error.message })
        } else {
          setErrors({ general: data.error?.message || 'Failed to save profile' })
        }
        return
      }

      router.push(`/assessment/${token}/cv`)
    } catch (err) {
      setErrors({ general: 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (!token || !progress) return null

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.PROFILE} completedStages={progress.completedStages} />
      <StageHeader title="Your Profile" description="Please provide your contact information." />
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>First Name *</label>
            <input 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name *</label>
            <input 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number *</label>
          <input 
            name="phone" 
            type="tel"
            value={formData.phone} 
            onChange={handleChange} 
            required
            placeholder="+998"
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email (Optional)</label>
          <input 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>City (Optional)</label>
          <input 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
          />
        </div>

        {errors.general && <p style={{ color: 'var(--danger)' }}>{errors.general}</p>}

        <PrimaryButton type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Saving...' : 'Continue'}
        </PrimaryButton>
      </form>
    </AssessmentLayout>
  )
}
