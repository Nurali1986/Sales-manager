'use client'

import React from 'react'
import { useLanguage, Language } from '@/lib/i18n/LanguageContext'

interface Props {
  compact?: boolean
  style?: React.CSSProperties
}

export const LanguageSelector: React.FC<Props> = ({ compact = false, style }) => {
  const { lang, setLang } = useLanguage()

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: '0.25rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0.25rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        ...style
      }}
    >
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLang(item.code)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: compact ? '0.25rem 0.5rem' : '0.35rem 0.65rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: lang === item.code ? '#2563eb' : 'transparent',
            color: lang === item.code ? '#ffffff' : '#64748b',
            fontWeight: lang === item.code ? 700 : 500,
            fontSize: compact ? '0.75rem' : '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <span>{item.flag}</span>
          {!compact && <span>{item.label}</span>}
        </button>
      ))}
    </div>
  )
}
