import React from 'react'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextArea({ label, error, style, ...props }: TextAreaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
      <label style={{ fontWeight: 500 }}>{label}</label>
      <textarea
        style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          minHeight: '150px',
          fontFamily: 'inherit',
          fontSize: '1rem',
          resize: 'vertical',
          ...style
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</span>}
    </div>
  )
}
