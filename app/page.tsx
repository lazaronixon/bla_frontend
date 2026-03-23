import { redirect } from 'next/navigation'
import { getRole } from '@/lib/session'

export default async function RootPage() {
  redirect(await getRole() === 'librarian' ? '/librarian' : '/member')
}
