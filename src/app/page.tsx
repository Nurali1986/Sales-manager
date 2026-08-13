'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/i18n/LanguageContext'

export default function HomePage() {
  const { lang, setLang, t } = useLanguage()

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      color: '#f8fafc',
      fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header / Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            AI
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>
              Sales<span style={{ color: '#818cf8' }}>Recruit</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.7rem',
              color: '#94a3b8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              AI Assessment Platform
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '0.35rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => setLang(item.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: lang === item.code ? '#6366f1' : 'transparent',
                color: lang === item.code ? '#ffffff' : '#94a3b8',
                fontWeight: lang === item.code ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: lang === item.code ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Hero Content */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '4rem 1.5rem 6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1.25rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#c084fc',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#c084fc',
            boxShadow: '0 0 10px #c084fc'
          }} />
          {t.demoNotice}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          maxWidth: '900px',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {t.title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          maxWidth: '720px',
          lineHeight: 1.6,
          marginBottom: '3.5rem'
        }}>
          {t.subtitle}
        </p>

        {/* 2 Primary Navigation Buttons requested by user */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem',
          width: '100%',
          maxWidth: '780px',
          marginBottom: '5rem'
        }}>
          {/* HR Dashboard Button */}
          <Link
            href="/hr/login"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.2) 0%, rgba(30, 27, 75, 0.6) 100%)',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              textAlign: 'left',
              textDecoration: 'none',
              color: '#ffffff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.5)'
            }}
            className="card-hover-effect"
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.5)'
              }}>
                📊
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
                {t.hrButtonTitle}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {t.hrButtonDesc}
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#a5b4fc'
            }}>
              http://localhost:3000/hr/login &rarr;
            </div>
          </Link>

          {/* Candidate Assessment Button */}
          <Link
            href="/assessment/demo-assessment-token-123"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(168, 85, 247, 0.2) 0%, rgba(30, 27, 75, 0.6) 100%)',
              border: '1px solid rgba(192, 132, 252, 0.4)',
              textAlign: 'left',
              textDecoration: 'none',
              color: '#ffffff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.5)'
            }}
            className="card-hover-effect"
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.5)'
              }}>
                🎯
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
                {t.candidateButtonTitle}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {t.candidateButtonDesc}
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#d8b4fe'
            }}>
              Demo Assessment Link &rarr;
            </div>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ width: '100%' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            marginBottom: '2rem',
            color: '#f1f5f9',
            letterSpacing: '-0.02em'
          }}>
            {t.featuresTitle}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{
              padding: '1.5rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎙️</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
                {t.feature1Title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {t.feature1Desc}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚖️</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
                {t.feature2Title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {t.feature2Desc}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
                {t.feature3Title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {t.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        © 2026 Sales Recruitment Platform. {t.footerRights}
      </footer>
    </div>
  )
}
