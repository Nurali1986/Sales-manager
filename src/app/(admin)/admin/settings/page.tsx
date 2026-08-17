'use client'

import React, { useState } from 'react'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'registration' | 'vacancies' | 'security'>('registration')

  const [requireVerification, setRequireVerification] = useState(true)
  const [vacancyModeration, setVacancyModeration] = useState(true)
  const [maxVacancyDays, setMaxVacancyDays] = useState(30)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          ⚙️ Global Platforma Sozlamalari (Platform Settings)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Butun platformaning global ro'yxatdan o'tish, moderatsiya va xavfsizlik qoidalari.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0' }}>
        {[
          { id: 'general', label: 'Umumiy' },
          { id: 'registration', label: 'Ro‘yxatdan o‘tish' },
          { id: 'vacancies', label: 'Vakansiyalar qoidalari' },
          { id: 'security', label: 'Security & 2FA' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #dc2626' : '3px solid transparent',
              color: activeTab === tab.id ? '#dc2626' : '#64748b',
              fontWeight: activeTab === tab.id ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0' }}>
        {activeTab === 'registration' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontWeight: 900 }}>Ro‘yxatdan o‘tish sozlamalari</h3>
            <label style={checkLabelStyle}><input type="checkbox" defaultChecked /> ☑ Candidate ro‘yxatdan o‘tishi ochiq</label>
            <label style={checkLabelStyle}><input type="checkbox" defaultChecked /> ☑ Kompaniya ro‘yxatdan o‘tishi ochiq</label>
            <label style={checkLabelStyle}><input type="checkbox" checked={requireVerification} onChange={e => setRequireVerification(e.target.checked)} /> ☑ Kompaniya hujjatlar verifikatsiyasi majburiy</label>
          </div>
        )}

        {activeTab === 'vacancies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontWeight: 900 }}>Vakansiya e'lon qilish qoidalari</h3>
            <label style={checkLabelStyle}><input type="checkbox" checked={vacancyModeration} onChange={e => setVacancyModeration(e.target.checked)} /> ☑ Barcha yangi vakansiyalar moderatsiyadan o'tishi majburiy</label>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Vakansiyaning maksimal amal qilish muddati (kun)</label>
              <input type="number" value={maxVacancyDays} onChange={e => setMaxVacancyDays(parseInt(e.target.value) || 30)} style={{ width: '120px', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const checkLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }
