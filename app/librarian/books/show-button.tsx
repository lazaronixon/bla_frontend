import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpenIcon } from 'lucide-react'

export function BorrowingsButton({ id }: { id: number }) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href={`/librarian/books/${id}`}>
        <BookOpenIcon data-icon="inline-start" />
        Borrowings
      </Link>
    </Button>
  )
}
