'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { initialVacancies } from '@/lib/mockHrData'

export default function CandidateJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const jobId = resolvedParams.id

  const job = initialVacancies.find(j => j.id === jobId) || initialVacancies[0]

  const [isSaved, setIsSaved] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Apply Form state
  const [selectedResume, setSelectedResume] = useState('Elbek_Abdullayev_Resume.pdf')
  const [coverLetter, setCoverLetter] = useState('')
  const [confirmContacts, setConfirmContacts] = useState(true)

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowApplyModal(false)
    setShowSuccessModal(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back link */}
      <Link href="/candidate/jobs" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
        ← Qidiruv natijalariga qaytish
      </Link>

      {/* Header Banner Card */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {job.title}
          </h1>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', margin: '0.4rem 0' }}>
            TechCompany LLC • 💰 {job.minSalary && job.maxSalary ? `${(job.minSalary / 1000000).toFixed(0)}–${(job.maxSalary / 1000000).toFixed(0)} mln so‘m` : 'Kelishilgan'}
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
            <span>📍 {job.location}</span>
            <span>🏠 {job.workType}</span>
            <span>💼 {job.employmentType === 'full' ? 'To‘liq ish kuni' : 'Qisman'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsSaved(!isSaved)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: isSaved ? '#fffbeb' : '#ffffff',
              color: isSaved ? '#b45309' : '#334155',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {isSaved ? '✓ Saqlandi ⭐' : '⭐ Saqlash'}
          </button>

          <button
            onClick={() => setShowApplyModal(true)}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            📨 Ariza yuborish
          </button>
        </div>
      </div>

      {/* Main Detail Body */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem'
      }}>
        {/* About Company */}
        <div>
          <h3 style={sectionTitleStyle}>Kompaniya haqida</h3>
          <p style={textStyle}>
            TechCompany LLC — O'zbekistondagi yetakchi IT kompaniyalardan biri. Biz zamonaviy HR va biznes yechimlarini yaratish bilan shug'ullanamiz.
          </p>
        </div>

        {/* Responsibilities */}
        <div>
          <h3 style={sectionTitleStyle}>Vazifalar</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7 }}>
            <li>API va backend xizmatlarini avtomatlashtirilgan ile manual testlash</li>
            <li>Test keyslar hamda test ssenariylarini yaratish</li>
            <li>Jira tizimida aniqlangan bug-larni belgilash va kuzatish</li>
            <li>Regression va tutashuv testlarini o'tkazish</li>
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h3 style={sectionTitleStyle}>Talablar</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7 }}>
            <li>QA sohasida kamida 1 yillik amaliy tajriba</li>
            <li>Postman va Swagger vositalarini mukammal bilish</li>
            <li>SQL so'rovlarini yozish tajribasi (PostgreSQL, MySQL)</li>
            <li>REST API arxitekturasini tushunish</li>
          </ul>
        </div>

        {/* Offerings */}
        <div>
          <h3 style={sectionTitleStyle}>Biz taklif qilamiz</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7 }}>
            <li>5/2 ish grafigi (Gibrid va Moslashuvchan rejim)</li>
            <li>Raqobatbardosh maosh hamda choraklik bonuslar</li>
            <li>Bepul tushlik va korporativ tadbirlar</li>
            <li>Professional va mansab pillapoyasidan o'sish imkoniyati</li>
          </ul>
        </div>

        {/* Recruitment Process Steps */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <h3 style={sectionTitleStyle}>Ish jarayoni (Recruitment Flow)</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {[
              { step: '1. Ariza', desc: 'CV yuborish' },
              { step: '2. HR interview', desc: 'Online suhbat' },
              { step: '3. Technical interview', desc: 'Texnik topshiriq' },
              { step: '4. Offer', desc: 'Taklifnoma' }
            ].map((st, i) => (
              <div key={i} style={{ flex: 1, minWidth: '160px', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>{st.step}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{st.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0, fontWeight: 800, fontSize: '1.35rem' }}>
              {job.title} uchun ariza
            </h2>

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
              <div>
                <label style={labelStyle}>Rezyume *</label>
                <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)} style={inputStyle}>
                  <option value="Elbek_Abdullayev_Resume.pdf">📄 Elbek_Abdullayev_Resume.pdf (Asosiy)</option>
                  <option value="QA_Specialist_CV.pdf">📄 QA_Specialist_CV.pdf</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Cover letter (Qo'shimcha xat)</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Nima uchun ushbu vakansiyaga qiziqayotganingizni yozing..."
                  style={{ ...inputStyle, fontFamily: 'inherit' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={confirmContacts}
                  onChange={(e) => setConfirmContacts(e.target.checked)}
                />
                ☐ Kontakt ma'lumotlarimni tasdiqlayman
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} style={cancelBtnStyle}>Bekor qilish</button>
                <button type="submit" style={primaryBtnStyle}>📨 Ariza yuborish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.35rem', color: '#0f172a' }}>
              Arizangiz yuborildi!
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
              <strong>{job.title}</strong> • TechCompany LLC<br />
              HR sizning arizangizni tez orada ko‘rib chiqadi.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/candidate/applications')
                }}
                style={primaryBtnStyle}
              >
                Arizani ko‘rish ➔
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/candidate/jobs')
                }}
                style={cancelBtnStyle}
              >
                Boshqa ishlarni qidirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const sectionTitleStyle: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }
const textStyle: React.CSSProperties = { margin: 0, color: '#334155', lineHeight: 1.6, fontSize: '0.95rem' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const primaryBtnStyle: React.CSSProperties = { padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 800, cursor: 'pointer' }
