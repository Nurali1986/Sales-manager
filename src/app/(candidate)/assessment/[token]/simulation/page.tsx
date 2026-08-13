'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { PrimaryButton } from '@/components/candidate/Button'
import { AssessmentStageType } from '@prisma/client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function SimulationPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [token, setToken] = useState<string | null>(null)
  const [progress, setProgress] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [micGranted, setMicGranted] = useState(false)
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<{sender: 'AI' | 'YOU', text: string}[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [sending, setSending] = useState(false)

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

  const requestMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicGranted(true)
      setError(null)
    } catch (err) {
      setError(t.micNotice)
    }
  }

  const startSimulation = async () => {
    setStarted(true)
    setSending(true)
    try {
      const res = await fetch(`/api/assessment/${token}/simulation/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'hello', history: [] })
      })
      const data = await res.json()
      if (res.ok && data.data?.response) {
        setMessages([{ sender: 'AI', text: data.data.response }])
      }
    } catch (e) {
      setError('Failed to start simulation.')
    } finally {
      setSending(false)
    }
  }

  const sendMessage = async () => {
    if (!currentInput.trim() || sending) return

    const newMsg = { sender: 'YOU' as const, text: currentInput }
    const newHistory = [...messages, newMsg]
    setMessages(newHistory)
    setCurrentInput('')
    setSending(true)

    try {
      const res = await fetch(`/api/assessment/${token}/simulation/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg.text, history: newHistory })
      })
      const data = await res.json()
      if (res.ok && data.data?.response) {
        setMessages(prev => [...prev, { sender: 'AI', text: data.data.response }])
      }
    } catch (e) {
      setError('Failed to get response.')
    } finally {
      setSending(false)
    }
  }

  const handleEnd = async () => {
    setSubmitting(true)
    setError(null)

    const transcript = messages.map(m => `${m.sender}:\n"${m.text}"`).join('\n\n')

    try {
      const res = await fetch(`/api/assessment/${token}/simulation/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })
      if (!res.ok) {
        throw new Error('Failed to proceed')
      }
      router.push(`/assessment/${token}/video`)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (!token || !progress) return null

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.LIVE_SALES} completedStages={progress.completedStages} />
      <StageHeader title={t.simTitle} description={t.simDesc} />

      {!micGranted ? (
        <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', backgroundColor: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t.micNotice}</h3>
          {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
          <PrimaryButton onClick={requestMic}>
            {t.allowMicBtn}
          </PrimaryButton>
        </div>
      ) : !started ? (
        <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', backgroundColor: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Microphone Allowed ✓</h3>
          <p style={{ color: 'var(--muted-text)', marginBottom: '2rem' }}>
            {t.simDesc}
          </p>
          <PrimaryButton onClick={startSimulation}>
            {t.startSimBtn}
          </PrimaryButton>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
            {t.aiConnected}
          </div>

          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'white',
            height: '400px',
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.sender === 'YOU' ? 'flex-end' : 'flex-start',
                backgroundColor: m.sender === 'YOU' ? 'var(--primary)' : '#f1f5f9',
                color: m.sender === 'YOU' ? 'white' : 'var(--text)',
                padding: '1rem',
                borderRadius: '0.75rem',
                maxWidth: '80%'
              }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem', fontWeight: 'bold' }}>
                  {m.sender === 'YOU' ? 'You' : 'AI Customer'}
                </div>
                {m.text}
              </div>
            ))}
            {sending && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--muted-text)', fontSize: '0.875rem' }}>
                AI is typing...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={currentInput}
              onChange={e => setCurrentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t.typeSimMessage}
              disabled={sending}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
            />
            <PrimaryButton onClick={sendMessage} disabled={sending || !currentInput.trim()}>
              {t.sendBtn}
            </PrimaryButton>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={handleEnd}
              disabled={submitting || messages.length < 2}
              style={{ padding: '0.75rem 2rem', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', backgroundColor: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {submitting ? 'Ending...' : t.endSimBtn}
            </button>
          </div>
        </div>
      )}
    </AssessmentLayout>
  )
}
