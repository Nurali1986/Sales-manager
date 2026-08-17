'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies, Vacancy } from '@/lib/mockHrData'

export default function CandidateJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Vacancy[]>(initialVacancies)
  const [query, setQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('Toshkent')
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['vac-1'])

  const [showFiltersModal, setShowFiltersModal] = useState(false)

  const toggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter(i => i !== id))
    } else {
      setSavedJobIds([...savedJobIds, id])
    }
  }

  const filteredJobs = jobs.filter(job => {
    if (query && !job.title.toLowerCase().includes(query.toLowerCase()) && !job.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search Bar Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          🔎 Ish qidirish (Job Search Engine)
        </h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 3, position: 'relative', minWidth: '260px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input
              type="text"
              placeholder="Lavozim, ko‘nikma yoki kompaniya..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1, position: 'relative', minWidth: '180px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>📍</span>
            <input
              type="text"
              placeholder="Hudud (masalan: Toshkent)"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            style={{
              padding: '0.65rem 1.75rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Qidirish
          </button>
        </div>

        {/* Quick Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <button style={filterBtnStyle}>📍 Hudud: Toshkent ▼</button>
          <button style={filterBtnStyle}>💰 Maosh: 5–20 mln ▼</button>
          <button style={filterBtnStyle}>💼 Kategoriya: IT ▼</button>
          <button style={filterBtnStyle}>🏠 Remote / Gibrid ▼</button>
          <button style={filterBtnStyle}>🕐 Ish turi: To'liq ▼</button>
          <button style={filterBtnStyle}>🎓 Tajriba: 1–3 yil ▼</button>
          <button
            onClick={() => setShowFiltersModal(true)}
            style={{ ...filterBtnStyle, backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
          >
            🎛 Barcha filtrlar
          </button>
        </div>
      </div>

      {/* Job Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredJobs.map(job => {
          const isSaved = savedJobIds.includes(job.id)
          return (
            <div
              key={job.id}
              onClick={() => router.push(`/candidate/jobs/${job.id}`)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                position: 'relative'
              }}
              className="card-hover-effect"
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>{job.title}</span>
                  <span style={{
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    Tech Company
                  </span>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
                  💰 {job.minSalary && job.maxSalary ? `${(job.minSalary / 1000000).toFixed(0)}–${(job.maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Maosh kelishilgan'}
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  <span>📍 {job.location}</span>
                  <span>🏠 {job.workType === 'remote' ? 'Remote' : job.workType === 'hybrid' ? 'Gibrid' : 'Ofis'}</span>
                  <span>💼 {job.experience} tajriba</span>
                  <span>🕐 2 kun oldin</span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {job.skills.map(s => (
                    <span key={s} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={(e) => toggleSaveJob(job.id, e)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: isSaved ? '#fffbeb' : '#ffffff',
                    color: isSaved ? '#b45309' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {isSaved ? '✓ Saqlandi ⭐' : 'Saqlash ⭐'}
                </button>

                <button
                  onClick={() => router.push(`/candidate/jobs/${job.id}`)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Ko‘rish →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* "Barcha filtrlar" Modal */}
      {showFiltersModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, fontWeight: 800, fontSize: '1.35rem' }}>🎛 Filtrlar</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1.5rem 0' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📍 Hudud</div>
                {['Toshkent', 'Samarqand', 'Buxoro', 'Farg‘ona'].map(city => (
                  <label key={city} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={city === 'Toshkent'} /> {city}
                  </label>
                ))}
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📈 Tajriba</div>
                {['Tajribasiz', '1–3 yil', '3–6 yil', '6+ yil'].map(exp => (
                  <label key={exp} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="radio" name="expF" defaultChecked={exp === '1–3 yil'} /> {exp}
                  </label>
                ))}
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🏠 Ish formati</div>
                {['Ofis', 'Remote', 'Gibrid'].map(fmt => (
                  <label key={fmt} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={fmt !== 'Ofis'} /> {fmt}
                  </label>
                ))}
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🕐 Bandlik</div>
                {['To‘liq', 'Qisman', 'Stajirovka'].map(b => (
                  <label key={b} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={b === 'To‘liq'} /> {b}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button onClick={() => setShowFiltersModal(false)} style={cancelBtnStyle}>Tozalash</button>
              <button onClick={() => setShowFiltersModal(false)} style={primaryBtnStyle}>Filtrni qo‘llash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 1rem 0.6rem 2.4rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.9rem'
}

const filterBtnStyle: React.CSSProperties = {
  padding: '0.45rem 0.85rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#334155',
  cursor: 'pointer'
}

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const primaryBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer' }
