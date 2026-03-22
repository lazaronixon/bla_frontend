import { getDashboardStats, getDueToday, getMembersWithOverdueBooks } from '@/app/actions/books'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookIcon, BookOpenIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { formatLocalDateTime } from '@/lib/utils'

export default async function Page() {
  const [stats, dueToday, overdueMembers] = await Promise.all([
    getDashboardStats(),
    getDueToday(),
    getMembersWithOverdueBooks(),
  ])

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="flex gap-4 [&>*]:min-w-48">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
            <div className="rounded-full bg-muted p-2">
              <BookIcon className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_books}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
            <div className="rounded-full bg-muted p-2">
              <BookOpenIcon className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_borrowed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Due Today</h2>
        <div className="overflow-auto max-h-80 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Member Email</TableHead>
                <TableHead className="text-right">Borrowed on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueToday.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No books due today.
                  </TableCell>
                </TableRow>
              ) : (
                dueToday.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell><Link href={`/librarian/books/${b.book.id}`} className="underline">#{b.book.id}</Link></TableCell>
                    <TableCell className="font-medium">{b.book.title}</TableCell>
                    <TableCell>#{b.user.id}</TableCell>
                    <TableCell>{b.user.email_address}</TableCell>
                    <TableCell className="text-right">{formatLocalDateTime(b.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell colSpan={3} />
                <TableCell className="text-right font-medium">{dueToday.length} {dueToday.length === 1 ? 'book' : 'books'}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Members with Overdue Books</h2>
        <div className="overflow-auto max-h-80 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="w-full">Email</TableHead>
                <TableHead className="text-right">Member since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No members with overdue books.
                  </TableCell>
                </TableRow>
              ) : (
                overdueMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>#{m.id}</TableCell>
                    <TableCell>{m.email_address}</TableCell>
                    <TableCell className="text-right">{new Date(m.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell />
                <TableCell className="text-right font-medium">{overdueMembers.length} {overdueMembers.length === 1 ? 'member' : 'members'}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  )
}
