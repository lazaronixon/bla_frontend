'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateBook, type UpdateBookState } from '@/app/actions/books'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { LoaderCircleIcon } from 'lucide-react'

type Book = {
  id: number
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
}

export function EditBookForm({
  book,
  onSuccess,
}: {
  book: Book
  onSuccess?: () => void
}) {
  const boundAction = updateBook.bind(null, book.id)
  const [state, action, pending] = useActionState<UpdateBookState, FormData>(
    boundAction,
    undefined
  )

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) onSuccess?.()
  }, [state, onSuccess])

  return (
    <form action={action} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" defaultValue={book.title} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="author">Author</FieldLabel>
          <Input id="author" name="author" defaultValue={book.author} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="genre">Genre</FieldLabel>
          <Input id="genre" name="genre" defaultValue={book.genre} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
          <Input id="isbn" name="isbn" defaultValue={book.isbn} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="copies">Copies</FieldLabel>
          <Input id="copies" name="copies" type="number" min="1" defaultValue={book.copies} required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="self-start">
        {pending && (
          <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
        )}
        {pending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
