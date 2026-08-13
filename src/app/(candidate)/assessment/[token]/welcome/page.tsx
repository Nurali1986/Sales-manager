'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { StageHeader } from '@/components/candidate/StageHeader'
import { PrimaryButton } from '@/components/candidate/Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function WelcomePage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [token, setToken] = useState<string | null>(null)
  const [jobTitle, setJobTitle] = useState('')

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
        if (res.data?.job?.title) {
          setJobTitle(res.data.job.title)
        }
      })
  }, [token])

  if (!token) return null

  return (
    <AssessmentLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text)' }}>
          {jobTitle || 'Sales Manager'} {t.salesAssessmentTitle}
        </h1>
        <p style={{ color: 'var(--muted-text)', marginBottom: '2rem' }}>
          {t.estimatedTime}
        </p>

        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'left', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text)' }}>
            Assessment Steps
          </h2>
          <ol style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text)' }}>
            <li>{t.stageProfile}</li>
            <li>{t.stageCV}</li>
            <li>{t.stageTest}</li>
            <li>{t.stageCase}</li>
            <li>{t.stageScript}</li>
            <li>{t.stageSim}</li>
            <li>{t.stageVideo}</li>
          </ol>

          <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '0.9rem' }}>
            <strong>Note:</strong> {t.salesAssessmentSub}
          </div>
        </div>

        <PrimaryButton onClick={() => router.push(`/assessment/${token}/profile`)} style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem' }}>
          {t.startAssessment}
        </PrimaryButton>
      </div>
    </AssessmentLayout>
  )
}
