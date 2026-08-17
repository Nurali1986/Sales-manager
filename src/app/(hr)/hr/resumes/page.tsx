'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialCandidates, Candidate } from '@/lib/mockHrData'

export default function ResumeSearchPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('Toshkent')
  const [minSalary, setMinSalary] = useState(8000000)
  const [maxSalary, setMaxSalary] = useState(15000000)
  const [experience, setExperience] = useState('1–3 yil')
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  // Filter Modal state
  const [filterRegions, setFilterRegions] = useState<string[]>(['Toshkent'])
  const [filterExp, setFilterExp] = useState<string[]>(['1–3 yil'])
  const [filterEdu, setFilterEdu] = useState<string[]>(['Oliy'])
  const [filterLangs, setFilterLangs] = useState<string[]>(['O‘zbek', 'Rus'])
  const [filterFormat, setFilterFormat] = useState<string[]>(['Ofis', 'Remote'])

  const handleToggleFavorite = (id: string) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
  }

  const filtered = candidates.filter(c => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.title.toLowerCase().includes(query.toLowerCase()) && !c.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          🔎 Rezume qidirish (Resume Search Engine)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Millionlab nomzodlar bazasidan mos kadrlarni qidirib toping va taklif yuboring.
        </p>
      </div>

      {/* Quick Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '240px' }}>
            <label style={labelStyle}>🔍 Lavozim yoki ko‘nikma</label>
            <input
              type="text"
              placeholder="masalan: QA Engineer, Postman, Sales"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={labelStyle}>📍 Hudud</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} style={inputStyle}>
              <option value="Toshkent">Toshkent</option>
              <option value="Samarqand">Samarqand</option>
              <option value="Buxoro">Buxoro</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={labelStyle}>💼 Tajriba</label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} style={inputStyle}>
              <option value="1–3 yil">1–3 yil</option>
              <option value="3–6 yil">3–6 yil</option>
              <option value="6+ yil">6+ yil</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <button
            onClick={() => setShowFiltersModal(true)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🎛 Barcha filtrlar
          </button>

          <button
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🔎 Qidirish
          </button>
        </div>
      </div>

      {/* Resume Cards Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(c => (
          <div
            key={c.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <Link href={`/hr/candidates/${c.id}`} style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', textDecoration: 'none' }}>
                  👤 {c.name}
                </Link>
                <button
                  onClick={() => handleToggleFavorite(c.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                  title="Tanlanganlarga qo'shish"
                >
                  {c.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.5rem' }}>
                {c.title} • {(c.expectedSalary / 1000000).toFixed(0)} mln so'm
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                📍 {c.location} • 💼 Tajriba: {c.experienceYears} yil • 🎓 {c.education}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {c.skills.map(s => (
                  <span key={s} style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>

              <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155' }}>{c.summary}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '160px', alignItems: 'flex-end' }}>
              <button
                onClick={() => router.push(`/hr/candidates/${c.id}`)}
                style={{ width: '100%', padding: '0.55rem 1rem', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Rezyumeni ko'rish
              </button>
              <button
                onClick={() => router.push('/hr/messages')}
                style={{ width: '100%', padding: '0.55rem 1rem', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Xabar yuborish
              </button>
              <button
                onClick={() => alert('Nomzod QA Engineer vakansiyasiga biriktirildi.')}
                style={{ width: '100%', padding: '0.55rem 1rem', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Vakansiyaga biriktirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* "Barcha Filtrlar" Big Modal */}
      {showFiltersModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, fontWeight: 800, fontSize: '1.35rem' }}>🎛 Filtrlar (Advanced Filters)</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1.5rem 0' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📍 Hudud</div>
                {['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Namangan'].map(city => (
                  <label key={city} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={city === 'Toshkent'} /> {city}
                  </label>
                ))}
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💼 Tajriba</div>
                {['Tajribasiz', '1–3 yil', '3–6 yil', '6+ yil'].map(exp => (
                  <label key={exp} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={exp === '1–3 yil'} /> {exp}
                  </label>
                ))}
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>🎓 Ta'lim</div>
                {['Oliy', 'O‘rta maxsus', 'O‘rta'].map(edu => (
                  <label key={edu} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={edu === 'Oliy'} /> {edu}
                  </label>
                ))}
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💻 Ish formati</div>
                {['Ofis', 'Remote', 'Gibrid'].map(fmt => (
                  <label key={fmt} style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" defaultChecked={fmt !== 'Gibrid'} /> {fmt}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button onClick={() => setShowFiltersModal(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }}>Tozalash</button>
              <button onClick={() => setShowFiltersModal(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Filtrni qo‘llash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#1e293b',
  marginBottom: '0.4rem'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.9rem'
}
