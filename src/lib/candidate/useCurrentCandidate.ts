'use client'

import { useEffect, useMemo, useState } from 'react'

export interface CurrentCandidate {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  city: string | null
}

type CandidateMeResponse = {
  data?: {
    candidate?: CurrentCandidate
  }
  error?: {
    code: string
    message: string
  }
}

export function getCandidateFullName(candidate: Pick<CurrentCandidate, 'firstName' | 'lastName'> | null) {
  if (!candidate) return 'Nomzod'
  return `${candidate.firstName} ${candidate.lastName}`.trim() || 'Nomzod'
}

export function getCandidateInitials(candidate: Pick<CurrentCandidate, 'firstName' | 'lastName'> | null) {
  const name = getCandidateFullName(candidate)
  const parts = name.split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'N'

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function calculateCandidateCompleteness(candidate: CurrentCandidate | null) {
  if (!candidate) return 0

  const fields = [
    candidate.firstName,
    candidate.lastName,
    candidate.phone,
    candidate.email,
    candidate.city,
  ]

  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
}

export function useCurrentCandidate() {
  const [candidate, setCandidate] = useState<CurrentCandidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadCandidate() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/candidate/auth/me', {
          credentials: 'include',
          cache: 'no-store',
        })
        const payload = (await response.json()) as CandidateMeResponse

        if (!response.ok || !payload.data?.candidate) {
          throw new Error(payload.error?.message || 'Nomzod profili topilmadi.')
        }

        if (isMounted) {
          setCandidate(payload.data.candidate)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setCandidate(null)
          setError(err instanceof Error ? err.message : 'Nomzod profili topilmadi.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCandidate()

    return () => {
      isMounted = false
    }
  }, [])

  return useMemo(
    () => ({
      candidate,
      isLoading,
      error,
      fullName: getCandidateFullName(candidate),
      initials: getCandidateInitials(candidate),
      completeness: calculateCandidateCompleteness(candidate),
    }),
    [candidate, error, isLoading]
  )
}
