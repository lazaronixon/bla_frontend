import { getBorrowedBooks } from '@/app/actions/books'
import {
  Table,
  TableBody,
  TableCell,
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome to BLA Library.</p>
      </div>
      <h2 className="text-lg font-semibold tracking-tight">My Borrowings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Borrowed on</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Returned</TableHead>
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
                <TableCell className="font-medium">{b.book.title}</TableCell>
                <TableCell>{b.book.author}</TableCell>
                <TableCell>{formatLocalDateTime(b.created_at)}</TableCell>
                <TableCell><DueCell dueAt={b.due_at} /></TableCell>
                <TableCell>{b.returned_at ? formatLocalDateTime(b.returned_at) : '—'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
