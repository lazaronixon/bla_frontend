import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LocalDateTime } from './local-datetime'
import { ReturnButton } from './return-button'

type Book = {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
}

type User = {
  id: number
  email_address: string
  role: string
}

type Borrowing = {
  id: number
  due_at: string
  returned_at: string | null
  created_at: string
  user: User
}

async function getBook(token: string, id: string): Promise<Book | null> {
  const res = await fetch(`${BACKEND_URL}/books/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json()
}

async function getBorrowings(token: string, id: string): Promise<Borrowing[]> {
  const res = await fetch(`${BACKEND_URL}/books/${id}/borrowings`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return []
  return res.json()
}

async function getCurrentUser(token: string) {
  const res = await fetch(`${BACKEND_URL}/my/user`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}


export default async function BookBorrowingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const user = await getCurrentUser(token)
  if (user?.role !== 'librarian') redirect('/')

  const { id } = await params
  const [book, borrowings] = await Promise.all([
    getBook(token, id),
    getBorrowings(token, id),
  ])

  if (!book) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{book.title}</h1>
        <p className="text-muted-foreground">{book.author}</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Genre</dt>
          <dd className="font-medium">{book.genre}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">ISBN</dt>
          <dd className="font-medium">{book.isbn}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Copies</dt>
          <dd className="font-medium">{book.copies}</dd>
        </div>
      </dl>
      <h2 className="text-lg font-semibold tracking-tight">Borrowings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Borrowed on</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Returned</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No borrowings yet.
              </TableCell>
            </TableRow>
          ) : (
            borrowings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.user.email_address}</TableCell>
                <TableCell><LocalDateTime iso={b.created_at} /></TableCell>
                <TableCell><LocalDateTime iso={b.due_at} /></TableCell>
                <TableCell>{b.returned_at ? <LocalDateTime iso={b.returned_at} /> : '—'}</TableCell>
                <TableCell className="text-right">
                  {!b.returned_at && <ReturnButton bookId={book.id} borrowingId={b.id} />}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
