'use client'

import React from 'react'

export default function AdminInterviewsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          📅 Platforma Intervyulari Statistikasi
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          O'tkazilgan va rejalashtirilgan onlayn/ofis suhbatlar ko'rsatkichlari.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Jami Rejalangan Intervyular', val: '8,921', color: '#2563eb' },
          { label: 'Online (Google Meet)', val: '6,450', color: '#0284c7' },
          { label: 'Ofisda Suhbatlar', val: '2,471', color: '#7c3aed' },
          { label: 'Muvaffaqiyatli Yakunlangan', val: '7,890', color: '#10b981' }
        ].map(item => (
          <div key={item.label} style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>{item.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: item.color }}>{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
