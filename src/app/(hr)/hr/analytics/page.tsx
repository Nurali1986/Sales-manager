'use client'

import React from 'react'

export default function AnalyticsPage() {
  const kpiCards = [
    { label: 'Jami vakansiyalar', value: '12', color: '#2563eb' },
    { label: 'Jami arizalar', value: '154', color: '#0284c7' },
    { label: 'O‘rtacha arizalar / vakansiya', value: '12.8', color: '#7c3aed' },
    { label: 'O‘rtacha ishga olish vaqti', value: '14 kun', color: '#d97706' },
    { label: 'Interview → Offer %', value: '42%', color: '#10b981' },
    { label: 'Offer → Hire %', value: '75%', color: '#16a34a' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          📊 HR Analitika (Recruitment Analytics Dashboard)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Vakansiyalar samaradorligi, nomzodlar manbalari va recruitment funnel metrikalari.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Graphical Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Arizalar Dinamikasi */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.1rem' }}>📈 Arizalar dinamikasi (Haftalik)</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { day: 'Dush', val: 24, h: '40%' },
              { day: 'Sesh', val: 38, h: '65%' },
              { day: 'Chor', val: 52, h: '85%' },
              { day: 'Pay', val: 45, h: '75%' },
              { day: 'Jum', val: 60, h: '100%' },
              { day: 'Shan', val: 18, h: '30%' },
              { day: 'Yak', val: 12, h: '20%' }
            ].map(bar => (
              <div key={bar.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>{bar.val}</span>
                <div style={{ width: '100%', height: bar.h, backgroundColor: '#3b82f6', borderRadius: '6px 6px 0 0' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manba bo'yicha nomzodlar */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.1rem' }}>🌐 Manba bo'yicha nomzodlar (Candidate Sources)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {[
              { source: 'hh.uz Platforma', pct: 62, count: '95 ariza', color: '#2563eb' },
              { source: 'Telegram Bot & Kanal', pct: 20, count: '31 ariza', color: '#0284c7' },
              { source: 'LinkedIn Direct', pct: 18, count: '28 ariza', color: '#7c3aed' }
            ].map(s => (
              <div key={s.source}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span>{s.source}</span>
                  <span>{s.pct}% ({s.count})</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', backgroundColor: s.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
