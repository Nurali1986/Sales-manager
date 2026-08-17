'use client'

import React from 'react'

export default function AdminApplicationsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          📩 Arizalar Analitikasi va Monitoringi (Applications Overview)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Platformadagi barcha 156,430 ta arizalar holatining umumiy ko'rsatkichlari.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Jami Arizalar', val: '156,430', color: '#2563eb' },
          { label: 'Yangi (New)', val: '12,430', color: '#0284c7' },
          { label: 'Screening', val: '31,221', color: '#d97706' },
          { label: 'Interview', val: '8,921', color: '#7c3aed' },
          { label: 'Offer', val: '2,231', color: '#10b981' },
          { label: 'Hired 🎉', val: '1,204', color: '#16a34a' },
          { label: 'Rejected', val: '74,000', color: '#ef4444' },
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
