'use client'

import React from 'react'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function AssessmentLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Sales Manager</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>{t.salesAssessmentTitle}</span>
          </div>
          <LanguageSelector compact />
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {children}
        </div>
      </main>

      <footer style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted-text)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Sales Recruitment Platform. {t.footerRights}
      </footer>
    </div>
  )
}
