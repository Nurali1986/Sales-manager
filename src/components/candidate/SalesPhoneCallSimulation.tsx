'use client'

import React, { useState, useEffect } from 'react'

interface Message {
  sender: 'ai' | 'candidate'
  text: string
  time: string
}

interface SalesPhoneCallSimulationProps {
  assessmentStageId?: string
  assessmentId?: string
  candidateId?: string
  productName?: string
  onComplete?: (score: number) => void
}

export function SalesPhoneCallSimulation({
  assessmentStageId,
  assessmentId,
  candidateId,
  productName = "Mebellar (Yotoqxona & Mehmonxona mebeli)",
  onComplete
}: SalesPhoneCallSimulationProps) {

  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle')
  const [callDuration, setCallDuration] = useState(0)
  const [inputText, setInputText] = useState('')
  const [isRecordingMic, setIsRecordingMic] = useState(false)

  // 5-Step Sales Script Progress Tracking
  const [scriptProgress, setScriptProgress] = useState({
    greeting: false,
    discovery: false,
    presentation: false,
    objections: false,
    closing: false
  })

  const [messages, setMessages] = useState<Message[]>([])

  // Call Duration Timer
  useEffect(() => {
    let timer: any = null
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [callState])

  // Initiate Phone Call
  const handleStartCall = () => {
    setCallState('ringing')
    setMessages([])
    setCallDuration(0)

    // Simulate 2.5s phone ringing (Gudok...)
    setTimeout(() => {
      setCallState('connected')
      const initialAiMsg: Message = {
        sender: 'ai',
        text: `Assalomu alaykum! Mebellar do'koniga xush kelibsiz. Ismim Madina. Sizga qaysi turdagi mebelimiz qiziq bo'ldi?`,
        time: '00:01'
      }
      setMessages([initialAiMsg])
    }, 2500)
  }

  // Handle Candidate Voice/Text Message Response
  const handleSendMessage = async () => {
    if (!inputText.trim() || callState !== 'connected') return

    const candidateMsg: Message = {
      sender: 'candidate',
      text: inputText.trim(),
      time: formatTime(callDuration)
    }

    const updated = [...messages, candidateMsg]
    setMessages(updated)
    const userText = inputText.trim()
    setInputText('')

    // Evaluate 5-Step Script Progress in Realtime
    const lower = userText.toLowerCase()
    setScriptProgress(prev => ({
      greeting: prev.greeting || lower.includes('assalomu') || lower.includes('salom') || lower.includes('ismim'),
      discovery: prev.discovery || lower.includes('xona') || lower.includes('o\'lcham') || lower.includes('dizayn') || lower.includes('uslub'),
      presentation: prev.presentation || lower.includes('mdf') || lower.includes('dovodchik') || lower.includes('antivandal') || lower.includes('sifat'),
      objections: prev.objections || lower.includes('narx') || lower.includes('qimmat') || lower.includes('kafolat') || lower.includes('aksiya'),
      closing: prev.closing || lower.includes('o\'lchash') || lower.includes('dostavka') || lower.includes('shanba') || lower.includes('bepul')
    }))

    // Generate Dynamic AI Customer Response (Gemini AI Simulation)
    setTimeout(() => {
      let aiResponseText = "Tushunarli. Lekin narxi biroz qimmat emasmi? Boshqa do'konlarda arzonroq ko'rgandim."

      if (lower.includes('narx') || lower.includes('qimmat')) {
        aiResponseText = "To'g'ri, lekin o'ylab ko'rishim kerak... Uydegilar bilan maslahatlashib ko'ray-chi."
      } else if (lower.includes('o\'ylab') || lower.includes('maslahat')) {
        aiResponseText = "Bo'ladi, Telegram raqamimga rasmlari va narxlarini yuborsangiz yaxshi bo'lardi. Keyin joyiga borib o'lchab berish xizmati bormi?"
      } else if (lower.includes('o\'lchash') || lower.includes('bepul') || lower.includes('dostavka')) {
        aiResponseText = "Juda yaxshi! Unda shanba kuni ustangiz kelib joyini o'lchab ketsin. Raqamimni yozib oling."
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: aiResponseText,
        time: formatTime(callDuration + 2)
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1200)
  }

  // End Call & Trigger AI Evaluation
  const handleEndCall = async () => {
    setCallState('ended')

    // Calculate Script Completion Score
    const stepsPassed = Object.values(scriptProgress).filter(Boolean).length
    const score = Math.round((stepsPassed / 5) * 30) // Max 30 points for LIVE_SALES stage

    if (onComplete) {
      onComplete(score)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
      
      {/* Left: Smartphone Phone Call Interface */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '24px',
        padding: '2rem',
        color: '#ffffff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px',
        justifyContent: 'space-between'
      }}>
        
        {/* Phone Call Status Bar Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Ovozli AI Sotuv Simulyatsiyasi (Voice Call)
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '0.3rem', color: '#f8fafc' }}>
            Mebellar Do'koni — Mijoz (Madina)
          </div>

          {callState === 'idle' && (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Qo'ng'iroq qilish tugmasini bosing va mahsulotni sotishni boshlang.
            </div>
          )}

          {callState === 'ringing' && (
            <div style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: 800, marginTop: '0.5rem', animation: 'pulse 1s infinite' }}>
              🔔 Gudok ketmoqda... (Ringing)
            </div>
          )}

          {callState === 'connected' && (
            <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              🔴 LIVE • {formatTime(callDuration)}
            </div>
          )}

          {callState === 'ended' && (
            <div style={{ fontSize: '1rem', color: '#ef4444', fontWeight: 800, marginTop: '0.5rem' }}>
              📵 Qo'ng'iroq yakunlandi
            </div>
          )}
        </div>

        {/* Conversation Stream */}
        <div style={{ flex: 1, padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', maxHeight: '300px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'candidate' ? 'flex-end' : 'flex-start',
                backgroundColor: m.sender === 'candidate' ? '#10b981' : '#1e293b',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: m.sender === 'candidate' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                maxWidth: '82%',
                fontSize: '0.9rem',
                lineHeight: 1.4
              }}
            >
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.2rem', fontWeight: 700 }}>
                {m.sender === 'candidate' ? 'Siz (Sotuv Menejeri)' : 'Mijoz (Gemini AI)'} • {m.time}
              </div>
              {m.text}
            </div>
          ))}
        </div>

        {/* Call Controls & Speech Input */}
        {callState === 'idle' && (
          <button
            onClick={handleStartCall}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              fontWeight: 900,
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(16,185,129,0.4)'
            }}
          >
            📞 Qo'ng'iroq qilish (Start Call)
          </button>
        )}

        {callState === 'connected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Ovozli matn kiritish yoki gapirish..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                onClick={() => setIsRecordingMic(!isRecordingMic)}
                style={{ padding: '0.75rem 1rem', borderRadius: '12px', backgroundColor: isRecordingMic ? '#ef4444' : '#334155', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                title="Mikrofon"
              >
                🎙️
              </button>
              <button
                onClick={handleSendMessage}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}
              >
                Javob berish
              </button>
            </div>

            <button
              onClick={handleEndCall}
              style={{ padding: '0.65rem', borderRadius: '12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer' }}
            >
              📵 Suhbatni yakunlash
            </button>
          </div>
        )}

        {callState === 'ended' && (
          <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '14px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>✅ Qo'ng'iroq muvaffaqiyatli topshirildi</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>Gemini AI natijalarni tahlil qilmoqda...</div>
          </div>
        )}
      </div>

      {/* Right: 5-Step Sales Script Progress Panel */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
          📋 5 Bosqichli Skript Tekshiruvi
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div style={stepItemStyle(scriptProgress.greeting)}>
            <span>{scriptProgress.greeting ? '✅' : '⚪'}</span>
            <div>
              <strong>1. Salomlashish & Aloqa</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Do'kon nomi va ismni aytish</div>
            </div>
          </div>

          <div style={stepItemStyle(scriptProgress.discovery)}>
            <span>{scriptProgress.discovery ? '✅' : '⚪'}</span>
            <div>
              <strong>2. Ehtiyojni aniqlash</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Xona va o'lcham savollari</div>
            </div>
          </div>

          <div style={stepItemStyle(scriptProgress.presentation)}>
            <span>{scriptProgress.presentation ? '✅' : '⚪'}</span>
            <div>
              <strong>3. Taqdimot qilish</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>MDF, dovodchik va antivandal foydasi</div>
            </div>
          </div>

          <div style={stepItemStyle(scriptProgress.objections)}>
            <span>{scriptProgress.objections ? '✅' : '⚪'}</span>
            <div>
              <strong>4. E'tirozlar bilan ishlash</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Narx va shubhaga javob</div>
            </div>
          </div>

          <div style={stepItemStyle(scriptProgress.closing)}>
            <span>{scriptProgress.closing ? '✅' : '⚪'}</span>
            <div>
              <strong>5. Kelishuvni yakunlash</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bepul 3D o'lchash va muddat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const stepItemStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.65rem 0.85rem',
  borderRadius: '10px',
  backgroundColor: active ? '#ecfdf5' : '#f8fafc',
  border: active ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
  color: active ? '#065f46' : '#475569'
})
