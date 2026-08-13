'use client'

import React from 'react'
import Link from 'next/link'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useLanguage()

  return (
    <div className="hr-layout" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navigation Header */}
      <nav style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/hr/dashboard" style={{ textDecoration: 'none', color: '#1e293b' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Sales<span style={{ color: '#2563eb' }}>Recruit</span> HR
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
            <Link href="/hr/dashboard" style={{ textDecoration: 'none', color: '#475569' }}>
              {t.dashboardNav}
            </Link>
            <Link href="/hr/vacancies" style={{ textDecoration: 'none', color: '#475569' }}>
              {t.vacanciesNav}
            </Link>
            <Link href="/hr/candidates" style={{ textDecoration: 'none', color: '#475569' }}>
              {t.candidatesNav}
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSelector compact />
          <Link
            href="/hr/login"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            {t.logoutNav}
          </Link>
        </div>
      </nav>

      <main style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}
