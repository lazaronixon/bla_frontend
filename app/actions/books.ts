'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'

export type CreateBookState = { error?: string; success?: boolean } | undefined
export type UpdateBookState = { error?: string; success?: boolean } | undefined
export type DeleteBookState = { error?: string; success?: boolean } | undefined

export async function createBook(
  _state: CreateBookState,
  formData: FormData
): Promise<CreateBookState> {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const res = await fetch(`${BACKEND_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: formData.get('title'),
      author: formData.get('author'),
      genre: formData.get('genre'),
      isbn: formData.get('isbn'),
      copies: Number(formData.get('copies')),
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const messages = data.errors as string[] | undefined
    return { error: messages?.join('. ') ?? 'Something went wrong.' }
  }

  revalidatePath('/books')
  return { success: true }
}

export async function updateBook(
  id: number,
  _state: UpdateBookState,
  formData: FormData
): Promise<UpdateBookState> {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const res = await fetch(`${BACKEND_URL}/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: formData.get('title'),
      author: formData.get('author'),
      genre: formData.get('genre'),
      isbn: formData.get('isbn'),
      copies: Number(formData.get('copies')),
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const messages = data.errors as string[] | undefined
    return { error: messages?.join('. ') ?? 'Something went wrong.' }
  }

  revalidatePath('/books')
  return { success: true }
}

export async function deleteBook(id: number): Promise<DeleteBookState> {
  const token = await getSession()
  if (!token) redirect('/sign-in')

  const res = await fetch(`${BACKEND_URL}/books/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const messages = data.errors as string[] | undefined
    return { error: messages?.join('. ') ?? 'Something went wrong.' }
  }

  revalidatePath('/books')
  return { success: true }
}
