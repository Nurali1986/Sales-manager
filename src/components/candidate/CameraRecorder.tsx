'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PrimaryButton, SecondaryButton } from './Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface CameraRecorderProps {
  token: string
  onUploadSuccess: () => void
}

export function CameraRecorder({ token, onUploadSuccess }: CameraRecorderProps) {
  const { t } = useLanguage()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recording, setRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  useEffect(() => {
    if (recording && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (recording && timeLeft === 0) {
      stopRecording()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [recording, timeLeft])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError(t.cameraReqDesc)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }

  const startRecording = () => {
    if (!stream) return
    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setVideoBlob(blob)
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
    setRecording(true)
    setTimeLeft(60)
  }

  const retake = () => {
    setVideoBlob(null)
    setTimeLeft(60)
  }

  const handleUpload = async () => {
    if (!videoBlob) return
    setUploading(true)
    setError(null)

    try {
      const file = new File([videoBlob], 'video.webm', { type: 'video/webm' })

      const urlRes = await fetch(`/api/assessment/${token}/video/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'video/webm',
          fileSize: file.size
        })
      })

      if (!urlRes.ok) throw new Error('Failed to get upload URL')
      const { data: { storageKey } } = await urlRes.json()

      const submitRes = await fetch(`/api/assessment/${token}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageKey,
          originalFileName: file.name,
          mimeType: file.type || 'video/webm',
          fileSize: file.size
        })
      })

      if (!submitRes.ok) throw new Error('Failed to submit video')

      onUploadSuccess()
    } catch (e: unknown) {
      const err = e as any
      setError(err.message || 'An error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <div style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: '#000', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {!videoBlob ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
          />
        ) : (
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
          />
        )}

        {recording && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(255,0,0,0.8)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
            00:{timeLeft.toString().padStart(2, '0')} {t.secLeft}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {!videoBlob ? (
          recording ? (
            <PrimaryButton onClick={stopRecording} style={{ backgroundColor: 'var(--danger)' }}>
              {t.stopRecordingBtn}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={startRecording} disabled={!stream}>
              {t.startRecordingBtn}
            </PrimaryButton>
          )
        ) : (
          <>
            <SecondaryButton onClick={retake} disabled={uploading}>
              {t.rerecordBtn}
            </SecondaryButton>
            <PrimaryButton onClick={handleUpload} disabled={uploading}>
              {uploading ? t.uploadingVideoMsg : t.submitVideoBtn}
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  )
}
