'use client'

import React, { useState } from 'react'

interface SalesScriptBuilderStageProps {
  assessmentStageId?: string
  assessmentId?: string
  candidateId?: string
  onSubmitScript?: (scriptContent: string) => void
}

export function SalesScriptBuilderStage({
  onSubmitScript
}: SalesScriptBuilderStageProps) {

  const [greeting, setGreeting] = useState(`Assalomu alaykum! Mebellar do'koniga xush kelibsiz. Mening ismim [Ismingiz]. Sizga qanday mebel turini tanlashda yordam bera olaman?`)
  const [discovery, setDiscovery] = useState(`Sizga aynan qaysi xona uchun mebel kerak edi? (Yotoqxona, mehmonxona, oshxona yoki bolalar xonasi?) Xonangizning o'lchamlari taxminan qancha? Dizayn borasida klassika, modern yoki minimalist uslublarni yoqtirasizmi?`)
  const [presentation, setPresentation] = useState(`Aynan siz aytgan zamonaviy uslub uchun bizda yangi to'plam bor. Sababi karkasi toza Rossiya/Turkiya MDF materialidan ishlangan, yillar davomida sinmaydi. Dovodchik vakuum mexanizmi shovqinsiz yopiladi. Matosi antivandal — kir va suv yuqmaydi.`)
  const [objections, setObjections] = useState(`Narxi qimmat degan e'tirozga: "Sizni tushunaman, lekin bu mebelni 10-15 yilga olasiz. Bir marta sifatlisini olgan ma'qul, buning ustiga muddatli to'lov aksiyamiz bor." O'ylab ko'rish kerak desa: "Albatta, keling men Telegram orqali barcha rasm va hisob-kitobni yuboraman."`)
  const [closing, setClosing] = useState(`Agarda ushbu model ma'qul kelgan bo'lsa, bugunoq uyingizga ustamizni yuboraman. U borib joyini aniq o'lchab va 3D formatda ko'rsatadi. O'lchash xizmati bepul. Yetkazib berish shanba kuni qulaymi yoki yakshanbami?`)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    const fullScript = `1. GREETING:\n${greeting}\n\n2. DISCOVERY:\n${discovery}\n\n3. PRESENTATION:\n${presentation}\n\n4. OBJECTIONS:\n${objections}\n\n5. CLOSING:\n${closing}`

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      if (onSubmitScript) onSubmitScript(fullScript)
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
          📜 Sotuv Skriptini Yaratish (Head of Sales Assessment)
        </h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
          Sotuv bo'limi boshlig'i sifatida HR ko'rsatgan mahsulot uchun 5 ta bosqichdan iborat mukammal sotuv skriptini tuzing.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Step 1 */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>1. Salomlashish va aloqa o'rnatish (Greeting)</h3>
          <p style={sectionSubStyle}>Mijozda birinchi soniyalardanoq ijobiy taassurot qoldirish va o'zini tanishtirish.</p>
          <textarea rows={3} value={greeting} onChange={e => setGreeting(e.target.value)} style={textareaStyle} />
        </div>

        {/* Step 2 */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>2. Ehtiyojni aniqlash (Discovery & Questions)</h3>
          <p style={sectionSubStyle}>Mijozga tiqishtirmasdan, unga aynan nima kerakligini aniqlovchi ochiq savollar.</p>
          <textarea rows={4} value={discovery} onChange={e => setDiscovery(e.target.value)} style={textareaStyle} />
        </div>

        {/* Step 3 */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>3. Taqdimot qilish (Presentation & Benefit)</h3>
          <p style={sectionSubStyle}>Xususiyatni emas, mahsulotning mijozga beradigan amaliy foydasini va sifatini ko'rsatish.</p>
          <textarea rows={4} value={presentation} onChange={e => setPresentation(e.target.value)} style={textareaStyle} />
        </div>

        {/* Step 4 */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>4. E'tirozlar bilan ishlash (Handling Objections)</h3>
          <p style={sectionSubStyle}>"Narxi qimmat", "O'ylab ko'rishim kerak" kabi e'tirozlarni bartaraf etish javoblari.</p>
          <textarea rows={4} value={objections} onChange={e => setObjections(e.target.value)} style={textareaStyle} />
        </div>

        {/* Step 5 */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>5. Kelishuvni yakunlash (Closing the Sale)</h3>
          <p style={sectionSubStyle}>Mijozni qaror qabul qilishga undash (bepul 3D o'lchash, yetkazib berish kunini muqobil taklif qilish).</p>
          <textarea rows={4} value={closing} onChange={e => setClosing(e.target.value)} style={textareaStyle} />
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '1rem 2rem',
              borderRadius: '14px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              alignSelf: 'flex-end',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
            }}
          >
            {isSubmitting ? 'Gemini AI tahlil qilmoqda...' : '🚀 Sotuv Skriptini Topshirish va AI Tahlili'}
          </button>
        ) : (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.25rem', borderRadius: '14px', color: '#065f46', fontWeight: 800, textAlign: 'center' }}>
            🎉 Sotuv skripti muvaffaqiyatli topshirildi va Gemini AI tomonidan tahlil qilindi!
          </div>
        )}
      </div>
    </div>
  )
}

const sectionCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }
const sectionTitleStyle: React.CSSProperties = { margin: '0 0 0.25rem 0', fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }
const sectionSubStyle: React.CSSProperties = { margin: '0 0 0.85rem 0', fontSize: '0.85rem', color: '#64748b' }
const textareaStyle: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }
