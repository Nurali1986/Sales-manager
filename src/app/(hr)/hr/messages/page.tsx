'use client'

import React, { useState } from 'react'
import { initialCandidates, initialMessages, ChatMessage } from '@/lib/mockHrData'

export default function MessagesPage() {
  const [selectedCandidateId, setSelectedCandidateId] = useState('cand-1')
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState('')

  const activeCandidate = initialCandidates.find(c => c.id === selectedCandidateId) || initialCandidates[0]
  const conversation = messages.filter(m => m.candidateId === selectedCandidateId)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      candidateId: selectedCandidateId,
      sender: 'hr',
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
          💬 Xabarlar (Candidate Live Messenger)
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
        {/* Left Candidate List */}
        <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 800, color: '#0f172a' }}>
            Muloqotlar ({initialCandidates.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {initialCandidates.map(c => {
              const isSelected = c.id === selectedCandidateId
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    borderLeft: isSelected ? '4px solid #2563eb' : '4px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#2563eb' : '#0f172a' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0' }}>{c.title}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Active Chat Stream */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
          {/* Room Header */}
          <div style={{ padding: '1rem 1.5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{activeCandidate.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>{activeCandidate.title} • 📍 {activeCandidate.location}</div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>📞 {activeCandidate.phone}</div>
          </div>

          {/* Message Thread */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {conversation.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto' }}>
                Hozircha xabarlar yo'q. Birinchi xabarni yuboring.
              </div>
            ) : (
              conversation.map(m => {
                const isHr = m.sender === 'hr'
                return (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: isHr ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      backgroundColor: isHr ? '#2563eb' : '#ffffff',
                      color: isHr ? '#ffffff' : '#0f172a',
                      padding: '0.85rem 1.15rem',
                      borderRadius: isHr ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      border: isHr ? 'none' : '1px solid #cbd5e1'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{m.text}</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '0.35rem', textAlign: 'right', opacity: 0.8 }}>{m.timestamp}</div>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Xabar yozing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
