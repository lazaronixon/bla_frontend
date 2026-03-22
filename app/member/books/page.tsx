import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getBooks } from '@/app/actions/books'
import { BooksToolbar } from './books-toolbar'
import { BorrowButton } from './borrow-button'

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q } = await searchParams
  const query = Array.isArray(q) ? q[0] : q
  const books = await getBooks(query)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
      <BooksToolbar initialQuery={query} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead className="text-right">Copies</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>#{book.id}</TableCell>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell className="text-right">{book.copies}</TableCell>
              <TableCell className="text-right">
                <BorrowButton bookId={book.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-medium">Total</TableCell>
            <TableCell colSpan={4} />
            <TableCell className="text-right">{books.reduce((sum, book) => sum + book.copies, 0)}</TableCell>
            <TableCell className="text-right font-medium">{books.length} {books.length === 1 ? 'book' : 'books'}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
