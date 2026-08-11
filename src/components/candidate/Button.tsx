import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function PrimaryButton({ children, style, ...props }: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.7 : 1,
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, style, ...props }: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: 'transparent',
        color: 'var(--primary)',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius)',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.7 : 1,
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  )
}
