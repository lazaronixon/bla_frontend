import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Book = {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
}

async function getBooks(token: string): Promise<Book[]> {
  const res = await fetch('http://localhost:3000/books', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return []
  return res.json()
}

async function getCurrentUser(token: string) {
  const res = await fetch('http://localhost:3000/my/user', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function BooksPage() {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const user = await getCurrentUser(token)
  if (user?.role !== 'librarian') redirect('/')

  const books = await getBooks(token)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Copies</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
