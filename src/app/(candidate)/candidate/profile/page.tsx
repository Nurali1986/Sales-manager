'use client'

import React from 'react'
import Link from 'next/link'
import { initialCandidateProfile } from '@/lib/mockCandidateData'

export default function CandidateProfileOverviewPage() {
  const profile = initialCandidateProfile

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '750px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          EA
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            👤 {profile.name}
          </h1>
          <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.2rem' }}>
            📍 {profile.location} • 📞 {profile.phone}
          </div>
        </div>

        <Link
          href="/candidate/resume"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.875rem',
            textDecoration: 'none'
          }}
        >
          [ Profilni to‘ldirish ]
        </Link>
      </div>

      {/* Profile Completeness Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
          <span>Profil to‘liqligi</span>
          <span style={{ color: '#10b981' }}>{profile.completeness}%</span>
        </div>
        <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${profile.completeness}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '9999px' }} />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
          Portfolio va Sertifikatlar bo'limini to'ldirib, profil to'liqligini 100% ga yetkazing.
        </p>
      </div>
    </div>
  )
}
