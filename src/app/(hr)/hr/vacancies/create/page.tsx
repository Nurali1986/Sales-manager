'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HrCreateVacancyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Form State
  const [title, setTitle] = useState<'Sotuv Menejeri (Sales Manager)' | 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)'>('Sotuv Menejeri (Sales Manager)')
  const [minSalary, setMinSalary] = useState('8000000')
  const [maxSalary, setMaxSalary] = useState('18000000')
  const [location, setLocation] = useState('Toshkent')
  const [productName, setProductName] = useState('Mebellar do\'koni to\'plamlari')

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFinishWizard = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/hr/vacancies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: `${title} — ${productName}. Maosh: ${minSalary} – ${maxSalary} so'm. Hudud: ${location}.`,
          productName,
          salaryMin: minSalary,
          salaryMax: maxSalary,
          location,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || `Server xatosi: ${res.status}`)
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Vakansiyani yaratishda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <Link href="/hr/vacancies" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
          ← Vakansiyalar ro'yxatiga qaytish
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0 0 0' }}>
          ➕ Yangi Sotuv Vakansiyasini Yaratish
        </h1>
        <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Platformada faqat Sotuv Menejeri va Sotuv Bo'limi Boshlig'i lavozimlari uchun e'lon joylash mumkin.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['1. Lavozim Tanlash', '2. Maosh & Mahsulot', '3. Moderatsiya & E\'lon qilish'].map((s, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              backgroundColor: step >= idx + 1 ? '#2563eb' : '#e2e8f0',
              color: step >= idx + 1 ? '#ffffff' : '#64748b',
              fontWeight: 800,
              fontSize: '0.8rem',
              textAlign: 'center'
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {!submitted ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>1-Qadam: Lavozimni tanlang</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Boshqa sotuvga tegishli bo'lmagan lavozimlarni yaratish taqiqlangan.
              </p>

              <label style={roleCardStyle(title === 'Sotuv Menejeri (Sales Manager)')}>
                <input
                  type="radio"
                  name="roleSelect"
                  checked={title === 'Sotuv Menejeri (Sales Manager)'}
                  onChange={() => setTitle('Sotuv Menejeri (Sales Manager)')}
                />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>💼 Sotuv Menejeri (Sales Manager)</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    15 ta test savoli + 📞 Ovozli AI Qo'ng'iroq Simulyatsiyasi (5 bosqichli skript) + 1 Minutlik Video
                  </div>
                </div>
              </label>

              <label style={roleCardStyle(title === 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)')}>
                <input
                  type="radio"
                  name="roleSelect"
                  checked={title === 'Sotuv Bo\'limi Boshlig\'i (Head of Sales)'}
                  onChange={() => setTitle('Sotuv Bo\'limi Boshlig\'i (Head of Sales)')}
                />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>👨‍💼 Sotuv Bo'limi Boshlig'i (Head of Sales)</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    15 ta test savoli + 📜 5 Bosqichli Sotuv Skripti Yozish Builder + 1 Minutlik Pitch Video
                  </div>
                </div>
              </label>

              <button onClick={() => setStep(2)} style={nextBtnStyle}>Keyingisi ➔</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>2-Qadam: Maosh va Mahsulot Ma'lumotlari</h3>

              <div>
                <label style={labelStyle}>Mebel / Mahsulot nomi (Nomzod sotishi kerak bo'lgan xizmat) *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="masalan: Yotoqxona va mehmonxona mebellari"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Minimal Maosh (so'm)</label>
                  <input type="text" value={minSalary} onChange={e => setMinSalary(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Maksimal Maosh (so'm)</label>
                  <input type="text" value={maxSalary} onChange={e => setMaxSalary(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Shahar / Hudud</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} style={backBtnStyle}>Orqaga</button>
                <button onClick={() => setStep(3)} style={nextBtnStyle}>Keyingisi ➔</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>3-Qadam: Moderatsiyaga topshirish</h3>
              
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.25rem', borderRadius: '12px', color: '#1e40af', fontSize: '0.9rem' }}>
                E'lon: <strong>{title}</strong><br />
                Mahsulot: <strong>{productName}</strong> | Maosh: <strong>{(parseInt(minSalary)/1000000).toFixed(0)} – {(parseInt(maxSalary)/1000000).toFixed(0)} mln so'm</strong><br />
                Hudud: <strong>{location}</strong><br />
                Nomzodlar avtomatik ravishda <strong>Gemini AI 6-Bosqichli Assessment</strong> sinovidan o'tkaziladi.
              </div>

              {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '12px', color: '#991b1b', fontSize: '0.9rem', fontWeight: 600 }}>
                  ❌ {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={backBtnStyle} disabled={loading}>Orqaga</button>
                <button
                  onClick={handleFinishWizard}
                  disabled={loading}
                  style={{
                    ...nextBtnStyle,
                    backgroundColor: loading ? '#9ca3af' : '#dc2626',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? '⏳ Yuborilmoqda...' : '🚀 Vakansiyani Moderatsiyaga Yuborish'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Vakansiya muvaffaqiyatli yaratildi va SuperAdmin Moderatsiyasiga yuborildi!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            SuperAdmin tasdiqlashi bilan e'lon jonli ravishda `localhost:3000` ga chiqadi.
          </p>

          <button
            onClick={() => router.push('/hr/vacancies')}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
          >
            Vakansiyalar ro'yxatiga qaytish ➔
          </button>
        </div>
      )}
    </div>
  )
}

const roleCardStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  padding: '1.25rem',
  borderRadius: '14px',
  border: active ? '2px solid #2563eb' : '1px solid #cbd5e1',
  backgroundColor: active ? '#eff6ff' : '#f8fafc',
  cursor: 'pointer'
})

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }
const nextBtnStyle: React.CSSProperties = { padding: '0.75rem 1.5rem', borderRadius: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', alignSelf: 'flex-end' }
const backBtnStyle: React.CSSProperties = { padding: '0.75rem 1.5rem', borderRadius: '10px', backgroundColor: '#fff', color: '#64748b', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }
