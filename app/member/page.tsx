import { getBorrowedBooks } from '@/app/actions/books'
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
import { DueCell } from '@/components/due-cell'

export default async function Page() {
  const borrowings = await getBorrowedBooks()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <h2 className="text-lg font-semibold tracking-tight">My Borrowings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-right">Borrowed on</TableHead>
            <TableHead className="text-right">Due</TableHead>
            <TableHead className="text-right">Returned</TableHead>
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
                <TableCell>#{b.book.id}</TableCell>
                <TableCell className="font-medium">{b.book.title}</TableCell>
                <TableCell>{b.book.author}</TableCell>
                <TableCell className="text-right">{formatLocalDateTime(b.created_at)}</TableCell>
                <TableCell className="text-right"><DueCell dueAt={b.due_at} /></TableCell>
                <TableCell className="text-right">{b.returned_at ? formatLocalDateTime(b.returned_at) : '—'}</TableCell>
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
