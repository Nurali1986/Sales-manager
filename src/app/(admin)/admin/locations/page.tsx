'use client'

import React, { useState } from 'react'
import { initialAdminLocations, AdminLocation } from '@/lib/mockAdminData'

export default function AdminLocationsPage() {
  const [locations] = useState<AdminLocation[]>(initialAdminLocations)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          📍 Hududlar va Tumanlar Katalogi
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Viloyatlar hamda tumanlar iyerarxiyasi.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {locations.map(loc => (
          <div key={loc.id} style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.75rem' }}>
              📍 {loc.region}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {loc.districts.map(d => (
                <span key={d} style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.85rem', padding: '0.3rem 0.75rem', borderRadius: '8px', fontWeight: 600 }}>
                  🏞️ {d}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
