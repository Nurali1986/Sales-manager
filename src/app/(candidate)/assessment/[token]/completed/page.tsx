'use client'

import { AssessmentLayout } from '@/components/candidate/AssessmentLayout'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'

export default function CompletedPage({ params }: { params: Promise<{ token: string }> }) {
  const { t } = useLanguage()
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

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.congratsTitle}</h1>

        <p style={{ fontSize: '1.125rem', color: 'var(--muted-text)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          {t.congratsDesc}
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius)',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          {t.backToHome}
        </Link>
      </div>
    </AssessmentLayout>
  )
}
