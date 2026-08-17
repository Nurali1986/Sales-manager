'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialCandidates, Candidate } from '@/lib/mockHrData'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Candidate[]>(initialCandidates.filter(c => c.isFavorite))

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(c => c.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          ⭐ Tanlangan nomzodlar (Saved Candidates)
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Keyinchalik ko'rib chiqish yoki vakansiyalarga taklif qilish uchun saqlab qo'yilgan nomzodlar.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          Hali hech qanday nomzod saqlanmadi.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {favorites.map(c => (
            <div
              key={c.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <Link href={`/hr/candidates/${c.id}`} style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', textDecoration: 'none' }}>
                    👤 {c.name}
                  </Link>
                  <button onClick={() => handleRemoveFavorite(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                    ★
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700 }}>{c.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.4rem 0' }}>📍 {c.location} • 💼 {c.experienceYears} yil tajriba</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {c.skills.map(s => (
                    <span key={s} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => router.push('/hr/messages')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  💬 Xabar
                </button>
                <button
                  onClick={() => alert(`${c.name} QA Engineer vakansiyasiga biriktirildi.`)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  🔗 Vakansiyaga biriktirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
