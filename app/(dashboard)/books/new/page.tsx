import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'
import { NewBookForm } from './new-book-form'

async function getCurrentUser(token: string) {
  const res = await fetch(`${BACKEND_URL}/my/user`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function NewBookPage() {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const user = await getCurrentUser(token)
  if (user?.role !== 'librarian') redirect('/')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Book</h1>
      <NewBookForm />
    </div>
  )
}
