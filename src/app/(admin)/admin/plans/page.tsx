'use client'

import React, { useState } from 'react'
import { initialAdminPlans, AdminPlan } from '@/lib/mockAdminData'

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<AdminPlan[]>(initialAdminPlans)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Plan Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [vacanciesLimit, setVacanciesLimit] = useState(10)
  const [resumeLimit, setResumeLimit] = useState(200)
  const [teamLimit, setTeamLimit] = useState(3)

  const handleCreatePlan = () => {
    if (!name.trim()) return
    const newP: AdminPlan = {
      id: `plan-${Date.now()}`,
      name: name.trim().toUpperCase(),
      price: price ? `${price} UZS` : '0 UZS',
      period: 'oyiga',
      activeVacanciesLimit: vacanciesLimit,
      resumeViewsLimit: resumeLimit,
      teamLimit,
      features: [`${vacanciesLimit} ta faol vakansiya`, `${resumeLimit} ta rezyume ko'rish`]
    }
    setPlans([...plans, newP])
    setShowCreateModal(false)
    setName('')
    setPrice('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            📦 Tarif Rejalari Boshqaruvi (Subscription Plans)
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            HR va kompaniyalar uchun obuna rejalari hamda limitlarini sozlash.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Tarif yaratish
        </button>
      </div>

      {/* Plans Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {plans.map(p => (
          <div
            key={p.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: p.isPopular ? '2px solid #dc2626' : '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            {p.isPopular && (
              <span style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: '#dc2626', color: '#fff', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                ENG POPULYAR
              </span>
            )}
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#0f172a' }}>{p.name}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', margin: '0.5rem 0' }}>
                {p.price} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>/{p.period}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '1rem 0', fontSize: '0.9rem', color: '#334155' }}>
                <div>📋 Faol vakansiyalar: <strong>{p.activeVacanciesLimit} ta</strong></div>
                <div>🔎 Rezyume ko'rish: <strong>{p.resumeViewsLimit} ta</strong></div>
                <div>👥 Recruiterlar posti: <strong>{p.teamLimit} kishi</strong></div>
              </div>
            </div>

            <button
              onClick={() => alert(`${p.name} tarifi tahrirlash kiritildi.`)}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              ✏️ Tahrirlash
            </button>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '440px' }}>
            <h3 style={{ marginTop: 0, fontWeight: 900, fontSize: '1.25rem' }}>+ Yangi Tarif Yaratish</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Tarif nomi *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ENTERPRISE PLUS" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Narxi (UZS) *</label>
                <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="5000000" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Vakansiya limiti</label>
                  <input type="number" value={vacanciesLimit} onChange={e => setVacanciesLimit(parseInt(e.target.value) || 1)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Rezyume limiti</label>
                  <input type="number" value={resumeLimit} onChange={e => setResumeLimit(parseInt(e.target.value) || 10)} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowCreateModal(false)} style={cancelBtnStyle}>Bekor qilish</button>
              <button onClick={handleCreatePlan} style={primaryBtnStyle}>Saqlash</button>
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
const primaryBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: '#fff', fontWeight: 800, cursor: 'pointer' }
