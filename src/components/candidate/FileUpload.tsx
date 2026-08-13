'use client'

import React, { useState, useRef } from 'react'
import { PrimaryButton } from './Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface FileUploadProps {
  token: string
  onUploadSuccess: () => void
}

export function FileUpload({ token, onUploadSuccess }: FileUploadProps) {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0]
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.')
        setFile(null)
        return
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selected.type) && !selected.name.match(/\.(pdf|doc|docx)$/i)) {
        setError('Only PDF, DOC, and DOCX files are allowed.')
        setFile(null)
        return
      }
      setFile(selected)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // 1. Get upload URL
      const urlRes = await fetch(`/api/assessment/${token}/cv/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileSize: file.size
        })
      })

      if (!urlRes.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { data: { storageKey } } = await urlRes.json()

      // 2. Submit completion
      const submitRes = await fetch(`/api/assessment/${token}/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageKey,
          originalFileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileSize: file.size
        })
      })

      if (!submitRes.ok) {
        throw new Error('Failed to submit CV')
      }

      onUploadSuccess()
    } catch (e: unknown) {
      const err = e as any
      setError(err.message || 'An error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          border: '2px dashed var(--border)',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius)',
          backgroundColor: 'var(--background)'
        }}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        {file ? (
          <div>
            <p style={{ fontWeight: 'bold' }}>{file.name}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <PrimaryButton
              style={{ marginTop: '1rem', backgroundColor: 'var(--muted-text)' }}
              onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value = '' }}
              disabled={uploading}
            >
              Cancel
            </PrimaryButton>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1rem', color: 'var(--muted-text)' }}>{t.dragDropText}</p>
            <PrimaryButton onClick={() => fileInputRef.current?.click()}>
              {t.uploadBtn}
            </PrimaryButton>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {file && (
        <PrimaryButton onClick={handleUpload} disabled={uploading}>
          {uploading ? t.submitting : t.next}
        </PrimaryButton>
      )}
    </div>
  )
}
