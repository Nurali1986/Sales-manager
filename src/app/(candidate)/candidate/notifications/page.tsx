'use client'

import React from 'react'
import Link from 'next/link'

export default function CandidateNotificationsPage() {
  const notifications = [
    { id: 1, text: '🔵 TechCompany LLC sizning arizangizni ko‘rib chiqdi.', time: '10 daqiqa oldin', link: '/candidate/applications' },
    { id: 2, text: '📅 Sizga HR interview belgilandi.', time: '1 soat oldin', link: '/candidate/interviews' },
    { id: 3, text: '💬 Madina Aliyeva sizga yangi xabar yubordi.', time: '2 soat oldin', link: '/candidate/messages' },
    { id: 4, text: '🎯 Sizga mos 5 ta yangi vakansiya topildi.', time: '1 kun oldin', link: '/candidate/jobs' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          🔔 Bildirishnomalar (Candidate Notifications)
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.map(n => (
          <Link
            key={n.id}
            href={n.link}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{n.text}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>{n.time}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
