'use client'

import React from 'react'

export default function AdminAnalyticsPage() {
  const funnel = [
    { step: 'Visitors (Tashrif buyuruvchilar)', count: '100,000', pct: 100 },
    { step: 'Registered Users (Ro\'yxatdan o\'tganlar)', count: '12,000', pct: 12 },
    { step: 'Created Resume (Rezyume yaratganlar)', count: '7,800', pct: 65 },
    { step: 'Applied (Ariza berganlar)', count: '3,744', pct: 48 },
    { step: 'Interview (Suhbatgacha yetganlar)', count: '674', pct: 18 },
    { step: 'Hired 🎉 (Ishga olinganlar)', count: '135', pct: 20 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          📊 Platforma Analitikasi & Funnel (Global Metrics)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Tashrif buyuruvchidan to ishga qabul qilinishgacha bo'lgan platforma voronkasi (Funnel).
        </p>
      </div>

      {/* Platform Conversion Funnel */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>
          🔻 Platform Conversion Funnel
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          {funnel.map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                <span>{item.step}</span>
                <span style={{ color: '#dc2626' }}>{item.count}</span>
              </div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(item.pct, 5)}%`, height: '100%', backgroundColor: '#dc2626', borderRadius: '9999px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
