'use client'

import React, { useState } from 'react'
import { initialInterviews, initialCandidates, initialVacancies, Interview } from '@/lib/mockHrData'

export default function InterviewsPage() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Form State for modal
  const [candidateId, setCandidateId] = useState(initialCandidates[0].id)
  const [vacancyTitle, setVacancyTitle] = useState(initialVacancies[0].title)
  const [date, setDate] = useState('2026-08-20')
  const [time, setTime] = useState('15:00')
  const [format, setFormat] = useState<'online' | 'office'>('online')
  const [linkOrAddress, setLinkOrAddress] = useState('https://meet.google.com/new-meeting-room')

  const handleCreateInterview = () => {
    const cand = initialCandidates.find(c => c.id === candidateId)
    const newInt: Interview = {
      id: `int-${Date.now()}`,
      candidateId,
      candidateName: cand ? cand.name : 'Muhammad Ali',
      vacancyTitle,
      date,
      time,
      format,
      linkOrAddress,
      interviewer: 'Azizbek Karimov'
    }
    setInterviews([...interviews, newInt])
    setShowScheduleModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            📅 Intervyular jadvali (Interview Calendar)
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Nomzodlar bilan onlayn va ofis suhbatlarini rejalashtirish va boshqarish.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          + Intervyu belgilash
        </button>
      </div>

      {/* View Switcher & Date Navigation */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
          {(['day', 'week', 'month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === mode ? '#ffffff' : 'transparent',
                color: viewMode === mode ? '#2563eb' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {mode === 'day' ? 'Kun' : mode === 'week' ? 'Hafta' : 'Oy'}
            </button>
          ))}
        </div>

        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
          17 – 23 Avgust, 2026-yil
        </div>
      </div>

      {/* Calendar Slots Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {interviews.map(item => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: item.format === 'online' ? '#eff6ff' : '#fef3c7',
                color: item.format === 'online' ? '#2563eb' : '#b45309',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '1.1rem'
              }}>
                {item.time}
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.1rem' }}>{item.date}</div>
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                  👤 {item.candidateName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, margin: '0.2rem 0' }}>
                  {item.vacancyTitle}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Suhbatdosh: <strong>{item.interviewer}</strong>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: item.format === 'online' ? '#dbeafe' : '#fef3c7',
                color: item.format === 'online' ? '#1e40af' : '#92400e',
                fontWeight: 800,
                fontSize: '0.8rem'
              }}>
                {item.format === 'online' ? '🌐 Google Meet' : '🏢 Ofisda suhbat'}
              </span>
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href={item.linkOrAddress}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}
                >
                  {item.format === 'online' ? 'Meet havolasi' : item.linkOrAddress}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.25rem' }}>+ Intervyu belgilash</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nomzod *</label>
                <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} style={inputStyle}>
                  {initialCandidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Vakansiya *</label>
                <select value={vacancyTitle} onChange={(e) => setVacancyTitle(e.target.value)} style={inputStyle}>
                  {initialVacancies.map(v => (
                    <option key={v.id} value={v.title}>{v.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Sana *</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Vaqt *</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Format *</label>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input type="radio" name="fmt" checked={format === 'online'} onChange={() => setFormat('online')} />
                    Online (Google Meet)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input type="radio" name="fmt" checked={format === 'office'} onChange={() => setFormat('office')} />
                    Ofis
                  </label>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Link / Manzil</label>
                <input
                  type="text"
                  value={linkOrAddress}
                  onChange={(e) => setLinkOrAddress(e.target.value)}
                  placeholder={format === 'online' ? 'https://meet.google.com/...' : 'Toshkent, Chilonzor tumani...'}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowScheduleModal(false)} style={cancelBtnStyle}>Bekor qilish</button>
              <button onClick={handleCreateInterview} style={primaryBtnStyle}>Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const primaryBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }
