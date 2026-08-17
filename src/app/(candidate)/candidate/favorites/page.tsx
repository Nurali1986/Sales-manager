'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialCandidateSavedJobs, CandidateSavedJob } from '@/lib/mockCandidateData'

export default function CandidateFavoritesPage() {
  const router = useRouter()
  const [savedJobs, setSavedJobs] = useState<CandidateSavedJob[]>(initialCandidateSavedJobs)

  const handleRemove = (id: string) => {
    setSavedJobs(savedJobs.filter(j => j.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          ⭐ Saqlangan vakansiyalar ({savedJobs.length})
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Kelajakda ariza topshirish uchun saqlangan vakansiyalar.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          Saqlangan vakansiyalar mavjud emas.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {savedJobs.map(job => (
            <div
              key={job.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>{job.jobTitle}</div>
                  <button onClick={() => handleRemove(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                    🗑
                  </button>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, margin: '0.2rem 0' }}>{job.companyName}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>📍 {job.location} • 💰 {job.salaryText}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => router.push(`/candidate/jobs/${job.id}`)}
                  style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Ochish ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
