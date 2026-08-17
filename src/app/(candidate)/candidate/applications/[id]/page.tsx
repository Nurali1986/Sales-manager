'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { initialCandidateApplications } from '@/lib/mockCandidateData'

export default function CandidateApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const appId = resolvedParams.id

  const app = initialCandidateApplications.find(a => a.id === appId) || initialCandidateApplications[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/candidate/applications" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
        ← Arizalar ro'yxatiga qaytish
      </Link>

      {/* App Summary Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {app.jobTitle}
            </h1>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>
              {app.companyName}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
              Ariza yuborildi: <strong>{app.appliedDate}</strong>
            </div>
          </div>

          <span style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '8px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            Status: {app.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Recruitment Timeline Stepper */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0' }}>
          📍 Recruitment Timeline (Jarayon bosqichlari)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
          {app.timeline.map((st, idx) => {
            const isLast = idx === app.timeline.length - 1
            return (
              <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative', paddingBottom: isLast ? 0 : '1.75rem' }}>
                {/* Connecting Line */}
                {!isLast && (
                  <div style={{
                    position: 'absolute',
                    left: '15px',
                    top: '30px',
                    bottom: 0,
                    width: '3px',
                    backgroundColor: st.done ? '#10b981' : '#e2e8f0'
                  }} />
                )}

                {/* Circle Icon */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: st.done ? '#10b981' : st.current ? '#f59e0b' : '#e2e8f0',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: st.current ? '0 0 0 4px #fef3c7' : 'none'
                }}>
                  {st.done ? '✓' : st.current ? '🟡' : '○'}
                </div>

                {/* Text Content */}
                <div>
                  <div style={{
                    fontWeight: st.done || st.current ? 800 : 600,
                    fontSize: '1rem',
                    color: st.done ? '#0f172a' : st.current ? '#b45309' : '#64748b'
                  }}>
                    {st.step}
                  </div>
                  {st.date && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {st.date}
                    </div>
                  )}
                  {st.current && (
                    <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600, marginTop: '0.25rem' }}>
                      Hozirda ushbu bosqichdasiz. HR vakili tez orada siz bilan bog'lanadi.
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
