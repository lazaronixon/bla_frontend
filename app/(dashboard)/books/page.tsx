import { redirect } from 'next/navigation'
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
import { BooksToolbar } from './books-toolbar'
import { EditBookButton } from './edit-book-button'

type Book = {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
}

async function getBooks(token: string, q?: string): Promise<Book[]> {
  const url = new URL(`${BACKEND_URL}/books`)
  if (q) url.searchParams.set('q', q)
  const res = await fetch(url.toString(), {
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

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const user = await getCurrentUser(token)
  if (user?.role !== 'librarian') redirect('/')

  const { q } = await searchParams
  const query = Array.isArray(q) ? q[0] : q
  const books = await getBooks(token, query)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
      <BooksToolbar initialQuery={query} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Copies</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.copies}</TableCell>
              <TableCell className="text-right">
                <EditBookButton book={book} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
