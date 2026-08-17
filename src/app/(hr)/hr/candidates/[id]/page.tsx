'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialCandidates, Candidate } from '@/lib/mockHrData'

export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const candidateId = resolvedParams.id

  const [candidate, setCandidate] = useState<Candidate>(
    initialCandidates.find(c => c.id === candidateId) || initialCandidates[0]
  )

  const [activeTab, setActiveTab] = useState<'profil' | 'rezyume' | 'arizalar' | 'muloqot' | 'intervyular' | 'izohlar' | 'tarix'>('profil')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<Candidate['status']>(candidate.status)
  const [rejectionReason, setRejectionReason] = useState('Tajriba yetarli emas')
  const [rejectionNote, setRejectionNote] = useState('')
  const [notes, setNotes] = useState<string[]>([
    'Nomzod suhbatda o\'zini juda yaxshi ko\'rsatdi.',
    'Postman va REST API bo\'yicha amaliy savollarga to\'g\'ri javob berdi.'
  ])
  const [newNoteInput, setNewNoteInput] = useState('')

  const handleAddNote = () => {
    if (newNoteInput.trim()) {
      setNotes([newNoteInput.trim(), ...notes])
      setNewNoteInput('')
    }
  }

  const handleSaveStatus = () => {
    setCandidate({
      ...candidate,
      status: newStatus,
      rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
      rejectionNote: newStatus === 'rejected' ? rejectionNote : undefined
    })
    setShowStatusModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {candidate.name}
              </h1>
              <span style={{
                backgroundColor: candidate.status === 'rejected' ? '#fef2f2' : '#eff6ff',
                color: candidate.status === 'rejected' ? '#ef4444' : '#2563eb',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                Status: {candidate.status.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 600, marginTop: '0.2rem' }}>
              {candidate.title} • 📍 {candidate.location} • 💼 {candidate.experienceYears} yil tajriba
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/hr/messages"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none'
            }}
          >
            💬 Xabar yuborish
          </Link>
          <Link
            href="/hr/interviews"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none'
            }}
          >
            📅 Intervyu
          </Link>
          <button
            onClick={() => setShowStatusModal(true)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#f1f5f9',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            ⚙️ Statusni o‘zgartirish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0' }}>
        {[
          { id: 'profil', label: 'Profil' },
          { id: 'rezyume', label: 'Rezyume' },
          { id: 'arizalar', label: 'Arizalar' },
          { id: 'muloqot', label: 'Muloqot (Chat)' },
          { id: 'intervyular', label: 'Intervyular' },
          { id: 'izohlar', label: 'Izohlar' },
          { id: 'tarix', label: 'Tarix' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        {activeTab === 'profil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Nomzod ma'lumotlari</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={detailLabelStyle}>Kutayotgan maoshi:</div>
                <div style={detailValueStyle}>{(candidate.expectedSalary / 1000000).toFixed(0)} mln so'm</div>

                <div style={detailLabelStyle}>Ta'lim:</div>
                <div style={detailValueStyle}>{candidate.education}</div>

                <div style={detailLabelStyle}>Telefon:</div>
                <div style={detailValueStyle}>{candidate.phone}</div>

                <div style={detailLabelStyle}>Email:</div>
                <div style={detailValueStyle}>{candidate.email}</div>
              </div>

              <div>
                <div style={detailLabelStyle}>Ko'nikmalar:</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {candidate.skills.map(s => (
                    <span key={s} style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={detailLabelStyle}>Tillar:</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {candidate.languages.map(l => (
                    <span key={l} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <div style={detailLabelStyle}>Nomzod haqida qisqacha:</div>
              <p style={{ color: '#334155', lineHeight: 1.6 }}>{candidate.summary}</p>
            </div>
          </div>
        )}

        {activeTab === 'rezyume' && (
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2rem', backgroundColor: '#f8fafc' }}>
            <h3 style={{ marginTop: 0 }}>📄 {candidate.name} - Resume PDF Document</h3>
            <p style={{ color: '#64748b' }}>PDF preview viewer simulation component.</p>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              ⬇ PDF rezyumeni yuklab olish
            </button>
          </div>
        )}

        {activeTab === 'izohlar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontWeight: 800 }}>HR va Recruiter izohlari</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Yangi izoh yozing..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <button
                onClick={handleAddNote}
                style={{ padding: '0.6rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Qo'shish
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {notes.map((note, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb', marginBottom: '0.25rem' }}>Azizbek Karimov (HR Admin)</div>
                  <div style={{ fontSize: '0.9rem', color: '#334155' }}>{note}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>Nomzod statusini o'zgartirish</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {['new', 'screening', 'interview', 'tech_interview', 'offer', 'hired', 'rejected'].map((st) => (
                <label key={st} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="radio" name="st" checked={newStatus === st} onChange={() => setNewStatus(st as any)} />
                  {st.toUpperCase()}
                </label>
              ))}
            </div>

            {newStatus === 'rejected' && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b' }}>Rad etish sababi</label>
                <select value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                  <option value="Tajriba yetarli emas">Tajriba yetarli emas</option>
                  <option value="Maosh to'g'ri kelmadi">Maosh to'g'ri kelmadi</option>
                  <option value="Boshqa nomzod tanlandi">Boshqa nomzod tanlandi</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowStatusModal(false)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
              <button onClick={handleSaveStatus} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const detailLabelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#64748b',
  marginBottom: '0.2rem'
}

const detailValueStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '1rem'
}
