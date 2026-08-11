import React from 'react'

interface StageHeaderProps {
  title: string
  description?: string
}

export function StageHeader({ title, description }: StageHeaderProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h1>
      {description && <p style={{ color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>{description}</p>}
    </div>
  )
}
