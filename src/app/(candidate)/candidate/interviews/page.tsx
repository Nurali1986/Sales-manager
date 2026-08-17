'use client'

import React from 'react'
import { initialCandidateInterviews } from '@/lib/mockCandidateData'

export default function CandidateInterviewsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          📅 Mening intervyularim (My Interviews)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          HR va Texnik menejerlar bilan belgilangan suhbatlar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {initialCandidateInterviews.map(item => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#ecfdf5',
                color: '#047857',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '1.25rem'
              }}>
                {item.time}
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.2rem' }}>{item.date}</div>
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
                  {item.jobTitle}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 700, margin: '0.2rem 0' }}>
                  {item.companyName} • {item.type}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Suhbatdosh: <strong>{item.interviewer}</strong> • Davomiyligi: <strong>{item.duration}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-end' }}>
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                🔗 Meetingga kirish (Google Meet)
              </a>
              <button
                onClick={() => alert('Intervyu Google Kalendaringizga qo\'shildi!')}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                📅 Calendar'ga qo‘shish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
