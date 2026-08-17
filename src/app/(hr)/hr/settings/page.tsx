'use client'

import React, { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'bildirishnomalar' | 'xavfsizlik' | 'email' | 'integratsiyalar'>('bildirishnomalar')

  const [notifs, setNotifs] = useState({
    newApplication: true,
    newMessage: true,
    interviewReminder: true,
    vacancyExpiry: true,
    candidateReply: true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          ⚙️ Sozlamalar (HR Workspace Settings)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Profil, bildirishnomalar, xavfsizlik va integratsiyalarni sozlash.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0' }}>
        {[
          { id: 'profil', label: 'Profil' },
          { id: 'bildirishnomalar', label: 'Bildirishnomalar' },
          { id: 'xavfsizlik', label: 'Xavfsizlik' },
          { id: 'email', label: 'Email' },
          { id: 'integratsiyalar', label: 'Integratsiyalar' }
        ].map(tab => (
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

      {/* Tab Content */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0' }}>
        {activeTab === 'bildirishnomalar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>Bildirishnomalar sozlamalari</h3>

            {[
              { id: 'newApplication', label: '☑ Yangi ariza kelganda ogohlantirish' },
              { id: 'newMessage', label: '☑ Yangi xabar kelganda' },
              { id: 'interviewReminder', label: '☑ Intervyu eslatmasi (30 daqiqa oldin)' },
              { id: 'vacancyExpiry', label: '☑ Vakansiya tugashidan oldin ogohlantirish' },
              { id: 'candidateReply', label: '☑ Nomzod javob berganda' }
            ].map(item => (
              <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                <input
                  type="checkbox"
                  checked={(notifs as any)[item.id]}
                  onChange={e => setNotifs({ ...notifs, [item.id]: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                {item.label}
              </label>
            ))}

            <button
              onClick={() => alert('Bildirishnomalar sozlamalari saqlandi!')}
              style={{
                marginTop: '1rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              Saqlash
            </button>
          </div>
        )}

        {activeTab === 'profil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <h3 style={{ margin: 0, fontWeight: 800 }}>HR Profil ma'lumotlari</h3>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>Ism-familiya</label>
              <input type="text" defaultValue="Azizbek Karimov" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>Email</label>
              <input type="email" defaultValue="azizbek@company.uz" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>Telefon</label>
              <input type="text" defaultValue="+998 90 123 45 67" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
