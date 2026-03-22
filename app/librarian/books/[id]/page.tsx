import { notFound } from 'next/navigation'
import { getBook, getBorrowings } from '@/app/actions/books'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatLocalDateTime } from '@/lib/utils'
import { ReturnButton } from './return-button'
import { DueCell } from './due-cell'

export default async function BookBorrowingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [book, borrowings] = await Promise.all([
    getBook(id),
    getBorrowings(id),
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
            <TableHead>ID</TableHead>
            <TableHead>Member</TableHead>
            <TableHead className="text-right">Borrowed on</TableHead>
            <TableHead className="text-right">Due</TableHead>
            <TableHead className="text-right">Returned</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No borrowings yet.
              </TableCell>
            </TableRow>
          ) : (
            borrowings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>#{b.user.id}</TableCell>
                <TableCell className="font-medium">{b.user.email_address}</TableCell>
                <TableCell className="text-right">{formatLocalDateTime(b.created_at)}</TableCell>
                <TableCell className="text-right"><DueCell dueAt={b.due_at} /></TableCell>
                <TableCell className="text-right">{b.returned_at ? formatLocalDateTime(b.returned_at) : '—'}</TableCell>
                <TableCell className="text-right">
                  <ReturnButton bookId={book.id} borrowingId={b.id} disabled={!!b.returned_at} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-medium">Total</TableCell>
            <TableCell colSpan={4} />
            <TableCell className="text-right font-medium">{borrowings.length} {borrowings.length === 1 ? 'borrowing' : 'borrowings'}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
