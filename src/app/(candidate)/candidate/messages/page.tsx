'use client'

import React, { useState } from 'react'
import { initialCandidateMessages, CandidateMessageItem } from '@/lib/mockCandidateData'

export default function CandidateMessagesPage() {
  const [messages, setMessages] = useState<CandidateMessageItem[]>(initialCandidateMessages)
  const [inputText, setInputText] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: CandidateMessageItem = {
      id: `c-msg-${Date.now()}`,
      sender: 'candidate',
      recruiterName: 'Madina Aliyeva',
      companyName: 'TechCompany LLC',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, newMsg])
    setInputText('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 140px)' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          💬 Xabarlar (Messages with Recruiters)
        </h1>
      </div>

      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        {/* Left Chat Contacts */}
        <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 800 }}>
            Kompaniyalar (2)
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', cursor: 'pointer' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#047857' }}>Madina Aliyeva</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>TechCompany LLC</div>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Azizbek Karimov</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Startup X</div>
            </div>
          </div>
        </div>

        {/* Right Active Room */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
          <div style={{ padding: '1rem 1.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Madina Aliyeva</div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>HR Manager • TechCompany LLC</div>
          </div>

          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(m => {
              const isCand = m.sender === 'candidate'
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isCand ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    backgroundColor: isCand ? '#10b981' : '#ffffff',
                    color: isCand ? '#ffffff' : '#0f172a',
                    padding: '0.85rem 1.15rem',
                    borderRadius: isCand ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    border: isCand ? 'none' : '1px solid #cbd5e1'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '0.35rem', textAlign: 'right', opacity: 0.8 }}>{m.timestamp}</div>
                </div>
              )
            })}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Xabar yozing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
