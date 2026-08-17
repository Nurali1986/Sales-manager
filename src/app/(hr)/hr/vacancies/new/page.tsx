import { redirect } from 'next/navigation'

export default function NewVacancyRedirect() {
  redirect('/hr/vacancies/create')
}
