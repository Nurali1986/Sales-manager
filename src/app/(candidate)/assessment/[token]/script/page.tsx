'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { PrimaryButton } from '@/components/candidate/Button'
import { TextArea } from '@/components/candidate/TextArea'
import { AutosaveIndicator, SaveState } from '@/components/candidate/AutosaveIndicator'
import { AssessmentStageType } from '@prisma/client'

export default function ScriptPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [progress, setProgress] = useState<any>(null)
  const [content, setContent] = useState('')
  const [scriptPrompt, setScriptPrompt] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  useEffect(() => {
    params.then(p => {
      setToken(p.token)
    })
  }, [params])

  useEffect(() => {
    if (!token) return

    Promise.all([
      fetch(`/api/assessment/${token}`).then(r => r.json()),
      fetch(`/api/assessment/${token}/script`).then(r => r.json())
    ]).then(([statusRes, scriptRes]) => {
      if (statusRes.data?.assessment) {
        setProgress({
          currentStage: statusRes.data.assessment.currentStage,
          completedStages: statusRes.data.assessment.completedStages
        })
      }
      if (scriptRes.data?.prompt) {
        setScriptPrompt(scriptRes.data.prompt)
        if (scriptRes.data.draft) {
          setContent(scriptRes.data.draft)
        }
      } else {
        setError(scriptRes.error?.message || 'Failed to load script prompt')
      }
      setLoading(false)
    })
  }, [token])

  // Debounced Autosave
  useEffect(() => {
    if (!token || loading || submitting) return

    const timer = setTimeout(async () => {
      if (content.trim() === '') return
      setSaveState('saving')
      try {
        const res = await fetch(`/api/assessment/${token}/script`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
        if (res.ok) {
          setSaveState('saved')
          setTimeout(() => setSaveState('idle'), 2000)
        } else {
          setSaveState('error')
        }
      } catch (err) {
        setSaveState('error')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [content, token, loading, submitting])

  const handleSubmit = async () => {
    if (content.length < 10) {
      setError('Please provide a more detailed script.')
      return
    }

    if (!window.confirm('Are you sure you want to submit? You cannot edit this later.')) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/assessment/${token}/script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error?.message || 'Failed to submit script')
      }

      router.push(`/assessment/${token}/simulation`)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (!token || loading) return <AssessmentLayout><p>Loading...</p></AssessmentLayout>

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.SCRIPT} completedStages={progress?.completedStages || []} />
      <StageHeader title="Sales Script Writing" description="Write a sales script based on the instructions below." />

      <div style={{ backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {scriptPrompt}
      </div>

      <div style={{ position: 'relative' }}>
        <TextArea 
          label="Your Script:" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your script here..."
          error={error || undefined}
          style={{ minHeight: '300px' }}
        />
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <AutosaveIndicator state={saveState} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>
          Minimum recommended length: 100 characters
        </span>
        <PrimaryButton 
          onClick={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Script'}
        </PrimaryButton>
      </div>    </AssessmentLayout>
  )
}
