'use client'

import React, { useMemo, useState } from 'react'
import { initialCandidateProfile, CandidateProfile } from '@/lib/mockCandidateData'
import { getCandidateFullName, useCurrentCandidate } from '@/lib/candidate/useCurrentCandidate'

export default function CandidateResumePage() {
  const [profile, setProfile] = useState<CandidateProfile>(initialCandidateProfile)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const { candidate } = useCurrentCandidate()

  const visibleProfile = useMemo(() => {
    if (!candidate) return profile

    return {
      ...profile,
      name: getCandidateFullName(candidate),
      location: candidate.city || profile.location,
      phone: candidate.phone,
      email: candidate.email || profile.email,
    }
  }, [candidate, profile])

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Top Controls Header */}
      <div className="resume-top-card" style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            📄 Mening rezyumem (My Resume Builder)
          </h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Rezyume ma'lumotlaringizni to'ldiring va HR menejerlarga havola yuboring.
          </p>
        </div>

        <div className="resume-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setEditingSection('personal')}
            style={actionBtnStyle}
          >
            ✏️ Tahrirlash
          </button>
          <button
            onClick={() => alert('Rezyume ko\'rish ko\'rinishi ochildi.')}
            style={actionBtnStyle}
          >
            👁 Ko‘rish
          </button>
          <button
            onClick={() => alert('PDF Rezyume yuklab olinmoqda...')}
            style={{ ...actionBtnStyle, backgroundColor: '#10b981', color: '#ffffff', border: 'none' }}
          >
            📥 PDF yuklash
          </button>
        </div>
      </div>

      {/* SECTION 1: SHAXSIY MA'LUMOTLAR */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>👤 Shaxsiy ma'lumotlar</h3>
          <button onClick={() => setEditingSection('personal')} style={editSectionBtnStyle}>✏️ Tahrirlash</button>
        </div>
        <div className="resume-two-column" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
          <div>
            <div style={labelStyle}>Ism-familiya:</div>
            <div style={valueStyle}>{visibleProfile.name}</div>
            <div style={{ ...labelStyle, marginTop: '0.75rem' }}>Telefon:</div>
            <div style={valueStyle}>{visibleProfile.phone}</div>
          </div>
          <div>
            <div style={labelStyle}>Shahar:</div>
            <div style={valueStyle}>{visibleProfile.location}</div>
            <div style={{ ...labelStyle, marginTop: '0.75rem' }}>Email:</div>
            <div style={valueStyle}>{visibleProfile.email}</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ISTALGAN LAVOZIM VA MAOSH */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>🎯 Istalgan lavozim va maosh</h3>
          <button onClick={() => setEditingSection('role')} style={editSectionBtnStyle}>✏️ Tahrirlash</button>
        </div>
        <div className="resume-two-column" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
          <div>
            <div style={labelStyle}>Istalgan lavozim:</div>
            <div style={{ ...valueStyle, color: '#10b981', fontWeight: 800 }}>{visibleProfile.targetRole}</div>
          </div>
          <div>
            <div style={labelStyle}>Kutilayotgan maosh:</div>
            <div style={{ ...valueStyle, color: '#10b981', fontWeight: 800 }}>{(visibleProfile.expectedSalary / 1000000).toFixed(0)}–12 mln so‘m</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: TAJRIBA */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>💼 Tajriba (Work Experience)</h3>
          <button onClick={() => setEditingSection('exp')} style={editSectionBtnStyle}>✏️ Tahrirlash</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
          {visibleProfile.experience.map(exp => (
            <div key={exp.id} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{exp.role} — {exp.company}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0' }}>{exp.startDate} – {exp.endDate}</div>
              <div style={{ fontSize: '0.875rem', color: '#334155' }}>{exp.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: TA'LIM */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>🎓 Ta'lim</h3>
          <button onClick={() => setEditingSection('edu')} style={editSectionBtnStyle}>✏️ Tahrirlash</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
          {visibleProfile.education.map(edu => (
            <div key={edu.id} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{edu.institution}</div>
              <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, margin: '0.2rem 0' }}>{edu.degree}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Yillar: {edu.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: KO'NIKMA VA TILLAR */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>🛠 Ko‘nikmalar va Tillar</h3>
          <button onClick={() => setEditingSection('skills')} style={editSectionBtnStyle}>✏️ Tahrirlash</button>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <div style={labelStyle}>Ko'nikmalar:</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0 1.25rem 0' }}>
            {visibleProfile.skills.map(s => (
              <span key={s} style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
                {s}
                <button onClick={() => handleRemoveSkill(s)} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '0.4rem', cursor: 'pointer' }}>×</button>
              </span>
            ))}
          </div>

          <div style={labelStyle}>Tillar:</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {visibleProfile.languages.map(l => (
              <span key={l.language} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                {l.language} — <strong>{l.level}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: PORTFOLIO */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>📁 Portfolio & Linklar</h3>
          <button onClick={() => setEditingSection('portfolio')} style={editSectionBtnStyle}>✏️ Tahrirlash</button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <a href={visibleProfile.portfolio.github} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'underline' }}>GitHub Profile</a>
          <a href={visibleProfile.portfolio.linkedin} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'underline' }}>LinkedIn Profile</a>
          <a href={visibleProfile.portfolio.website} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'underline' }}>Shaxsiy Veb-sayt</a>
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: '460px' }}>
            <h3 style={{ marginTop: 0, fontWeight: 800 }}>Tahrirlash</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Ushbu bo'lim ma'lumotlarini o'zgartiring.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setEditingSection(null)} style={cancelBtnStyle}>Yopish</button>
              <button onClick={() => setEditingSection(null)} style={primaryBtnStyle}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 720px) {
          .resume-top-card {
            padding: 1.25rem !important;
            align-items: stretch !important;
            flex-direction: column;
          }

          .resume-actions {
            flex-wrap: wrap;
          }

          .resume-actions button {
            flex: 1 1 140px;
          }

          .resume-two-column {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .resume-actions button {
            flex-basis: 100%;
          }
        }
      `}</style>
    </div>
  )
}

const sectionCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }
const sectionHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }
const sectionTitleStyle: React.CSSProperties = { fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }
const editSectionBtnStyle: React.CSSProperties = { padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }
const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.2rem' }
const valueStyle: React.CSSProperties = { fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }
const actionBtnStyle: React.CSSProperties = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '90%' }
const cancelBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontWeight: 600, cursor: 'pointer' }
const primaryBtnStyle: React.CSSProperties = { padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer' }
