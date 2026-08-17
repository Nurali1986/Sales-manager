'use client'

import React, { useState } from 'react'

export default function CandidateSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'rezyume' | 'maxfiylik' | 'bildirishnomalar' | 'xavfsizlik'>('maxfiylik')

  const [visibility, setVisibility] = useState<'all' | 'applied_only' | 'nobody'>('all')
  const [getOffers, setGetOffers] = useState(true)
  const [getMatchAlerts, setGetMatchAlerts] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          ⚙️ Sozlamalar (Candidate Settings)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Profil maxfiyligi, bildirishnomalar hamda xavfsizlik sozlamalari.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', overflowX: 'auto' }}>
        {[
          { id: 'profil', label: 'Profil' },
          { id: 'rezyume', label: 'Rezyume' },
          { id: 'maxfiylik', label: 'Maxfiylik' },
          { id: 'bildirishnomalar', label: 'Bildirishnomalar' },
          { id: 'xavfsizlik', label: 'Xavfsizlik' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #10b981' : '3px solid transparent',
              color: activeTab === tab.id ? '#10b981' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 600,
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
        {activeTab === 'maxfiylik' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.75rem 0', fontWeight: 800 }}>Resume ko‘rinishi (Visibility)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={radioLabelStyle}>
                  <input type="radio" name="vis" checked={visibility === 'all'} onChange={() => setVisibility('all')} />
                  Hamma HR ko‘ra oladi (Bazada ochiq qidiruv)
                </label>
                <label style={radioLabelStyle}>
                  <input type="radio" name="vis" checked={visibility === 'applied_only'} onChange={() => setVisibility('applied_only')} />
                  Faqat men ariza bergan kompaniyalar
                </label>
                <label style={radioLabelStyle}>
                  <input type="radio" name="vis" checked={visibility === 'nobody'} onChange={() => setVisibility('nobody')} />
                  Hech kim (Yopiq profil)
                </label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={checkLabelStyle}>
                <input type="checkbox" checked={getOffers} onChange={e => setGetOffers(e.target.checked)} />
                ☑ Ish takliflarini olish
              </label>
              <label style={checkLabelStyle}>
                <input type="checkbox" checked={getMatchAlerts} onChange={e => setGetMatchAlerts(e.target.checked)} />
                ☑ Mos vakansiyalar haqida notification olish
              </label>
            </div>

            <button
              onClick={() => alert('Maxfiylik sozlamalari saqlandi!')}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
                width: 'fit-content',
                marginTop: '0.5rem'
              }}
            >
              Saqlash
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const radioLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }
const checkLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }
