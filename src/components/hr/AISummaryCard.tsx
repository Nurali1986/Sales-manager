'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function AISummaryCard({ summary, strengths, weaknesses, confidence }: { summary: string, strengths: string[], weaknesses: string[], confidence: number }) {
  const { t } = useLanguage()

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          {t.aiRecommendationLabel}
        </h3>
        <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
          Confidence: {confidence}%
        </div>
      </div>

      <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{summary}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #dcfce7' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            {t.strengthsTitle}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {strengths.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                {s}
              </li>
            ))}
            {strengths.length === 0 && <li style={{ fontSize: '0.85rem', color: '#94a3b8' }}>None</li>}
          </ul>
        </div>

        <div style={{ backgroundColor: '#fff7ed', padding: '1rem', borderRadius: '8px', border: '1px solid #ffedd5' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
            {t.weaknessesTitle}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {weaknesses.map((w, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                <span style={{ color: '#f97316', fontWeight: 'bold' }}>!</span>
                {w}
              </li>
            ))}
            {weaknesses.length === 0 && <li style={{ fontSize: '0.85rem', color: '#94a3b8' }}>None</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
