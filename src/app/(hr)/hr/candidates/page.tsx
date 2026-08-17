'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialCandidates, Candidate } from '@/lib/mockHrData'

export default function CandidatesPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedCandidateForStatus, setSelectedCandidateForStatus] = useState<Candidate | null>(null)
  const [newStatus, setNewStatus] = useState<Candidate['status']>('new')
  const [rejectionReason, setRejectionReason] = useState('Tajriba yetarli emas')
  const [rejectionNote, setRejectionNote] = useState('')
  const [sendAutoMessage, setSendAutoMessage] = useState(true)

  const filteredCandidates = candidates.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleStatusSave = () => {
    if (!selectedCandidateForStatus) return
    setCandidates(candidates.map(c => {
      if (c.id === selectedCandidateForStatus.id) {
        return {
          ...c,
          status: newStatus,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
          rejectionNote: newStatus === 'rejected' ? rejectionNote : undefined
        }
      }
      return c
    }))
    setSelectedCandidateForStatus(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            👥 Nomzodlar (Candidates Workspace)
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Arizalar va nomzodlar recruitment pipeline bosqichlari bo'yicha.
          </p>
        </div>
        <Link
          href="/hr/resumes"
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          🔎 Rezume bazasidan qidirish
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="text"
            placeholder="Nomzod ismi yoki lavozimi bo'yicha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff'
          }}
        >
          <option value="all">Status: Barchasi</option>
          <option value="new">Yangi (New)</option>
          <option value="screening">Screening</option>
          <option value="interview">Interview</option>
          <option value="tech_interview">Tech Interview</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rad etilgan</option>
        </select>
      </div>

      {/* Candidate Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredCandidates.map((c) => (
          <div
            key={c.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <Link
                    href={`/hr/candidates/${c.id}`}
                    style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', textDecoration: 'none' }}
                  >
                    👤 {c.name}
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>{c.title}</div>
                </div>
                <span style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  ⭐ {c.matchRate}% moslik
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                📍 {c.location} • 💼 {c.experienceYears} yil tajriba
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {c.skills.map((s) => (
                  <span key={s} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setSelectedCandidateForStatus(c)
                  setNewStatus(c.status)
                }}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Status: {c.status.toUpperCase()} ✎
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={`/hr/candidates/${c.id}`}
                  style={{ padding: '0.4rem 0.75rem', backgroundColor: '#f1f5f9', color: '#1e293b', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Rezyume
                </Link>
                <Link
                  href="/hr/messages"
                  style={{ padding: '0.4rem 0.75rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  Xabar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Change & Rejection Modal */}
      {selectedCandidateForStatus && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '460px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.25rem' }}>Statusni o'zgartirish</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
              Nomzod: <strong>{selectedCandidateForStatus.name}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {[
                { id: 'new', label: 'Yangi' },
                { id: 'screening', label: 'Ko‘rib chiqilmoqda (Screening)' },
                { id: 'interview', label: 'Intervyu' },
                { id: 'tech_interview', label: 'Test topshirig‘i / Tech Interview' },
                { id: 'offer', label: 'Taklif (Offer)' },
                { id: 'hired', label: 'Ishga qabul qilindi' },
                { id: 'rejected', label: 'Rad etildi' }
              ].map((st) => (
                <label key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="candStatus"
                    checked={newStatus === st.id}
                    onChange={() => setNewStatus(st.id as any)}
                  />
                  {st.label}
                </label>
              ))}
            </div>

            {newStatus === 'rejected' && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b' }}>Rad etish sababi *</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '0.85rem' }}
                >
                  <option value="Tajriba yetarli emas">Tajriba yetarli emas</option>
                  <option value="Maosh to'g'ri kelmadi">Maosh to'g'ri kelmadi</option>
                  <option value="Boshqa nomzod tanlandi">Boshqa nomzod tanlandi</option>
                  <option value="Ko'nikmalar yetishmadi">Ko'nikmalar yetishmadi</option>
                </select>

                <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b' }}>Izoh</label>
                <textarea
                  rows={2}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Qo'shimcha izoh..."
                  style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '0.85rem' }}
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#991b1b' }}>
                  <input
                    type="checkbox"
                    checked={sendAutoMessage}
                    onChange={(e) => setSendAutoMessage(e.target.checked)}
                  />
                  ☑ Nomzodga avtomatik xabar yuborish
                </label>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedCandidateForStatus(null)}
                style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleStatusSave}
                style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
