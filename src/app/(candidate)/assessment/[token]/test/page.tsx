'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { AssessmentProgress } from '@/components/candidate/AssessmentProgress'
import { StageHeader } from '@/components/candidate/StageHeader'
import { PrimaryButton } from '@/components/candidate/Button'
import { AssessmentStageType } from '@prisma/client'

export default function TestPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [progress, setProgress] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => {
      setToken(p.token)
    })
  }, [params])

  useEffect(() => {
    if (!token) return

    Promise.all([
      fetch(`/api/assessment/${token}`).then(r => r.json()),
      fetch(`/api/assessment/${token}/test`).then(r => r.json())
    ]).then(([statusRes, testRes]) => {
      if (statusRes.data?.assessment) {
        setProgress({
          currentStage: statusRes.data.assessment.currentStage,
          completedStages: statusRes.data.assessment.completedStages
        })
      }
      if (testRes.data) {
        setQuestions(testRes.data)
      } else {
        setError(testRes.error?.message || 'Failed to load test')
      }
      setLoading(false)
    })
  }, [token])

  const handleOptionChange = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))

      const res = await fetch(`/api/assessment/${token}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error?.message || 'Failed to submit test')
      }

      router.push(`/assessment/${token}/case`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0)

  // ... (previous functions remain the same, just rendering logic changes below)

  if (!token || loading) return <AssessmentLayout><p>Loading test...</p></AssessmentLayout>

  const currentQuestion = questions[currentIndex]

  return (
    <AssessmentLayout>
      <AssessmentProgress currentStage={AssessmentStageType.TEST} completedStages={progress?.completedStages || []} />
      <StageHeader title="Sales Knowledge Test" description="Answer the following multiple-choice questions." />

      {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {questions.map((q, idx) => (
          <div 
            key={q.id}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: answers[q.id] ? 'var(--primary)' : (idx === currentIndex ? 'var(--border)' : 'var(--background)'),
              border: `2px solid ${idx === currentIndex ? 'var(--primary)' : 'var(--border)'}`,
              color: answers[q.id] ? 'white' : 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              flexShrink: 0
            }}
            onClick={() => setCurrentIndex(idx)}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '300px' }}>
        {questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'white' }}>
            <p style={{ color: 'var(--muted-text)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              {currentQuestion.questionText}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(currentQuestion.options as string[]).map((opt) => (
                <label 
                  key={opt} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    cursor: 'pointer',
                    padding: '1rem',
                    border: `1px solid ${answers[currentQuestion.id] === opt ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    backgroundColor: answers[currentQuestion.id] === opt ? 'rgba(0, 112, 243, 0.05)' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="radio" 
                    name={currentQuestion.id} 
                    value={opt} 
                    checked={answers[currentQuestion.id] === opt}
                    onChange={() => handleOptionChange(currentQuestion.id, opt)}
                    style={{ width: '1.2rem', height: '1.2rem' }}
                  />
                  <span style={{ fontSize: '1rem' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <PrimaryButton 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || submitting}
          style={{ backgroundColor: 'white', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          Previous
        </PrimaryButton>

        {currentIndex < questions.length - 1 ? (
          <PrimaryButton 
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={submitting}
          >
            Next
          </PrimaryButton>
        ) : (
          <PrimaryButton 
            onClick={() => {
              if (window.confirm('Are you sure you want to submit? You cannot change your answers afterwards.')) {
                handleSubmit()
              }
            }} 
            disabled={submitting || questions.length === 0}
            style={{ backgroundColor: 'var(--success)' }}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </PrimaryButton>
        )}
      </div>
    </AssessmentLayout>
  )
}
