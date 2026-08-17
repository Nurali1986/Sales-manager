'use client'

import React, { useState } from 'react'

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('All users')

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return
    alert(`Platforma xabarnomasi yuborildi! Audience: ${audience}`)
    setTitle('')
    setMessage('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          🔔 Platforma Notifications Broadcaster
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Barcha foydalanuvchilar, HR menejerlar va candidate'larga ommaviy xabarnomalar yuborish.
        </p>
      </div>

      <form onSubmit={handleSendBroadcast} style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle}>Sarlavha (Title) *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="masalan: Texnik profilaktika ishlari" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Xabar matni *</label>
          <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Platformada 18-avgust soat 02:00 da profilaktika o'tkaziladi..." style={{ ...inputStyle, fontFamily: 'inherit' }} />
        </div>

        <div>
          <label style={labelStyle}>Auditoriya (Audience)</label>
          <select value={audience} onChange={e => setAudience(e.target.value)} style={inputStyle}>
            <option value="All users">Barcha foydalanuvchilar (Candidates + HR)</option>
            <option value="Candidates">Faqat Candidate'lar</option>
            <option value="HR">Faqat HR Menejerlar</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', alignSelf: 'flex-start' }}>
          🚀 Broadcaster-ni yuborish
        </button>
      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }
