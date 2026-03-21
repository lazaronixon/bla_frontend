'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'
import type { Book, Borrowing } from '@/lib/types'


export async function getBooks(q?: string): Promise<Book[]> {
  const token = await getSession()
  const path = q ? `/books?q=${encodeURIComponent(q)}` : '/books'
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  return res.json()
}

export async function getBook(id: string): Promise<Book | null> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/books/${id}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getBorrowings(id: string): Promise<Borrowing[]> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/books/${id}/borrowings`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  return res.json()
}

export type CreateBookState = { error?: string; success?: boolean } | undefined
export type UpdateBookState = { error?: string; success?: boolean } | undefined
export type DeleteBookState = { error?: string; success?: boolean } | undefined

export async function createBook(
  _state: CreateBookState,
  formData: FormData
): Promise<CreateBookState> {
  const token = await getSession()

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

  revalidatePath('/librarian/books')
  return { success: true }
}

export async function updateBook(
  id: number,
  _state: UpdateBookState,
  formData: FormData
): Promise<UpdateBookState> {
  const token = await getSession()

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

  revalidatePath('/librarian/books')
  return { success: true }
}

export type ReturnBorrowingState = { error?: string; success?: boolean } | undefined

export async function returnBorrowing(
  bookId: number,
  borrowingId: number
): Promise<ReturnBorrowingState> {
  const token = await getSession()

  const res = await fetch(`${BACKEND_URL}/books/${bookId}/borrowings/${borrowingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ returned_at: new Date().toISOString() }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const messages = data.errors as string[] | undefined
    return { error: messages?.join('. ') ?? 'Something went wrong.' }
  }

  revalidatePath(`/librarian/books/${bookId}`)
  return { success: true }
}

export type CreateBorrowingState = { error?: string; success?: boolean } | undefined

export async function createBorrowing(bookId: number): Promise<CreateBorrowingState> {
  const token = await getSession()

  const res = await fetch(`${BACKEND_URL}/books/${bookId}/borrowings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const message = data.error as string | undefined
    return { error: message ?? 'Something went wrong.' }
  }

  revalidatePath('/member/books')
  return { success: true }
}

export async function deleteBook(id: number): Promise<DeleteBookState> {
  const token = await getSession()

  const res = await fetch(`${BACKEND_URL}/books/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const messages = data.errors as string[] | undefined
    return { error: messages?.join('. ') ?? 'Something went wrong.' }
  }

  revalidatePath('/librarian/books')
  return { success: true }
}
