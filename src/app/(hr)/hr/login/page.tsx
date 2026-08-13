'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HRLogin() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/hr/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kirishda xatolik yuz berdi.')
      } else {
        router.push('/hr/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>HR</div>
          <h2 style={styles.title}>{t.hrLoginTitle}</h2>
          <p style={styles.subtitle}>{t.hrLoginDesc}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>{t.emailInput}</label>
            <input
              id="email"
              type="email"
              placeholder="hr@pifagordemo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>{t.passwordInput}</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? t.submitting : t.loginSubmit}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Demo credentials:</p>
          <code style={styles.code}>Email: hr@pifagordemo.com</code>
          <code style={styles.code}>Password: password123</code>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '75vh',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
    padding: '2.5rem',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.875rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  button: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  footer: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
    textAlign: 'center' as const,
    fontSize: '0.8125rem',
    color: '#64748b',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f5f9',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    color: '#0f172a',
    display: 'block',
    width: 'fit-content',
    margin: '0 auto',
  }
}
