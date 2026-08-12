'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HRLogin() {
  const router = useRouter()
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
        setError(data.error || 'Kirishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.')
      } else {
        // Redirect to HR dashboard on success
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
          <h2 style={styles.title}>Tizimga kirish</h2>
          <p style={styles.subtitle}>HR Assessment boshqaruv paneli</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorAlert}>{error}</div>}

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email manzil</label>
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
            <label htmlFor="password" style={styles.label}>Parol</label>
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
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Demo ma'lumotlar:</p>
          <code style={styles.code}>Email: hr@pifagordemo.com</code>
          <code style={styles.code}>Parol: password123</code>
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
    minHeight: '80vh',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: 'var(--surface)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
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
    color: 'var(--primary)',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text)',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: 'var(--muted-text)',
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
    color: 'var(--danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius)',
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
    color: 'var(--text)',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: 'var(--background)',
  },
  button: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius)',
    border: 'none',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    marginTop: '0.5rem',
  },
  footer: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border)',
    textAlign: 'center' as const,
    fontSize: '0.8125rem',
    color: 'var(--muted-text)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: 'var(--background)',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    color: '#0f172a',
    display: 'block',
    width: 'fit-content',
    margin: '0 auto',
  }
}
