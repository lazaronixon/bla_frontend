'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createBook, type CreateBookState } from '@/app/actions/books'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { LoaderCircleIcon } from 'lucide-react'

export function NewBookForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, action, pending] = useActionState<CreateBookState, FormData>(
    createBook,
    undefined
  )

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) onSuccess?.()
  }, [state])

  return (
    <form action={action} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="author">Author</FieldLabel>
          <Input id="author" name="author" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="genre">Genre</FieldLabel>
          <Input id="genre" name="genre" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
          <Input id="isbn" name="isbn" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="copies">Copies</FieldLabel>
          <Input id="copies" name="copies" type="number" min="1" defaultValue="1" required />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className="self-start">
        {pending && (
          <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
        )}
        {pending ? 'Adding…' : 'Add book'}
      </Button>
    </form>
  )
}
