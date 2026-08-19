'use client'

import React from 'react'
import Link from 'next/link'
import {
  getCandidateFullName,
  getCandidateInitials,
  useCurrentCandidate,
} from '@/lib/candidate/useCurrentCandidate'

export default function CandidateProfileOverviewPage() {
  const { candidate, error, isLoading, completeness } = useCurrentCandidate()
  const fullName = getCandidateFullName(candidate)
  const initials = getCandidateInitials(candidate)

  if (isLoading) {
    return (
      <div className="candidate-profile-page">
        <div className="candidate-profile-card">
          <div className="candidate-avatar skeleton">...</div>
          <div style={{ flex: 1 }}>
            <div className="skeleton-line wide" />
            <div className="skeleton-line" />
          </div>
        </div>

        <style jsx>{profileStyles}</style>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="candidate-profile-page">
        <div className="candidate-profile-card empty">
          <h1>Profil topilmadi</h1>
          <p>{error || 'Ro‘yxatdan o‘tgan nomzod ma’lumoti topilmadi.'}</p>
          <Link href="/jobs" className="primary-link">
            Vakansiyalar sahifasiga qaytish
          </Link>
        </div>

        <style jsx>{profileStyles}</style>
      </div>
    )
  }

  return (
    <div className="candidate-profile-page">
      <div className="candidate-profile-card">
        <div className="candidate-avatar">
          {initials}
        </div>

        <div className="candidate-profile-copy">
          <h1>
            {fullName}
          </h1>
          <div className="candidate-meta">
            <span>📍 {candidate.city || 'Shahar kiritilmagan'}</span>
            <span>📞 {candidate.phone}</span>
            <span>✉️ {candidate.email || 'Email kiritilmagan'}</span>
          </div>
        </div>

        <Link
          href="/candidate/resume"
          className="primary-link"
        >
          Profilni to‘ldirish
        </Link>
      </div>

      <div className="candidate-profile-card progress-card">
        <div className="progress-title">
          <span>Profil to‘liqligi</span>
          <span>{completeness}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completeness}%` }} />
        </div>
        <p>
          Email, shahar va rezyume ma'lumotlarini to'ldirib, profilni HR menejerlar uchun tayyor holatga keltiring.
        </p>
      </div>

      <style jsx>{profileStyles}</style>
    </div>
  )
}

const profileStyles = `
  .candidate-profile-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 820px;
  }

  .candidate-profile-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.03);
  }

  .candidate-profile-card.empty {
    align-items: flex-start;
    flex-direction: column;
  }

  .candidate-profile-card.empty h1 {
    margin: 0;
    color: #0f172a;
    font-size: 1.5rem;
  }

  .candidate-profile-card.empty p {
    margin: 0;
    color: #64748b;
    line-height: 1.5;
  }

  .candidate-avatar {
    width: 72px;
    min-width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #10b981;
    color: #ffffff;
    font-weight: 900;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .candidate-profile-copy {
    min-width: 0;
    flex: 1;
  }

  .candidate-profile-copy h1 {
    font-size: 1.75rem;
    font-weight: 850;
    color: #0f172a;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .candidate-meta {
    color: #64748b;
    font-size: 0.95rem;
    margin-top: 0.4rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.85rem;
  }

  .primary-link {
    padding: 0.7rem 1.15rem;
    border-radius: 8px;
    background: #10b981;
    color: #ffffff;
    font-weight: 800;
    font-size: 0.9rem;
    text-decoration: none;
    white-space: nowrap;
    display: inline-flex;
    justify-content: center;
  }

  .progress-card {
    align-items: stretch;
    flex-direction: column;
    gap: 0.75rem;
  }

  .progress-title {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    color: #0f172a;
    font-weight: 850;
  }

  .progress-title span:last-child {
    color: #10b981;
  }

  .progress-track {
    width: 100%;
    height: 12px;
    background: #f1f5f9;
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #10b981;
    border-radius: 9999px;
  }

  .progress-card p {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0.15rem 0 0;
  }

  .skeleton {
    background: #e2e8f0;
    color: #94a3b8;
  }

  .skeleton-line {
    height: 14px;
    width: 56%;
    background: #e2e8f0;
    border-radius: 9999px;
    margin-top: 0.8rem;
  }

  .skeleton-line.wide {
    width: 74%;
    height: 24px;
    margin-top: 0;
  }

  @media (max-width: 640px) {
    .candidate-profile-card {
      padding: 1.25rem;
      align-items: flex-start;
      flex-direction: column;
    }

    .candidate-avatar {
      width: 60px;
      min-width: 60px;
      height: 60px;
      font-size: 1.25rem;
    }

    .candidate-profile-copy h1 {
      font-size: 1.4rem;
    }

    .candidate-meta {
      flex-direction: column;
      gap: 0.35rem;
      overflow-wrap: anywhere;
    }

    .primary-link {
      width: 100%;
    }
  }
`
