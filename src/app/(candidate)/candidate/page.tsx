import { redirect } from 'next/navigation'

export default function CandidateRootRedirect() {
  redirect('/candidate/dashboard')
}
