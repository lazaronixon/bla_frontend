'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PencilIcon, Trash2Icon, LoaderCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { EditBookForm } from './edit/edit-book-form'
import { deleteBook } from '@/app/actions/books'
import type { Book } from '@/lib/types'

type DialogState = 'edit' | 'delete' | null

export function BookActionsMenu({ book }: { book: Book }) {
  const router = useRouter()
  const [dialog, setDialog] = useState<DialogState>(null)
  const [pending, startTransition] = useTransition()

  const handleBookUpdated = useCallback(() => {
    setDialog(null)
    router.refresh()
    toast.success('Book updated successfully')
  }, [router])

  const handleBookDeleted = useCallback(() => {
    setDialog(null)
    router.refresh()
    toast.success('Book deleted successfully')
  }, [router])

  function handleDelete() {
    startTransition(async () => {
      const state = await deleteBook(book.id)
      if (state?.error) {
        toast.error(state.error)
      } else {
        handleBookDeleted()
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" onClick={() => setDialog('edit')}>
          <PencilIcon className="text-blue-500" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setDialog('delete')}>
          <Trash2Icon className="text-red-500" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <Dialog open={dialog === 'edit'} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <EditBookForm
            book={book}
            onSuccess={handleBookUpdated}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === 'delete'} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{book.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={pending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
              {pending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
