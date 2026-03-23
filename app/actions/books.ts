'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'
import type { Book, User, Borrowing } from '@/lib/types'


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

export async function getBorrowedBooks(): Promise<Borrowing[]> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/books/borrowed`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  return res.json()
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/my/user`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getDashboardStats(): Promise<{ total_books: number; total_borrowed: number; total_due_today: number }> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/books/total`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch dashboard stats')
  return res.json()
}

export async function getDueToday(): Promise<Borrowing[]> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/books/due_today`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch due today')
  return res.json()
}

export async function getMembersWithOverdueBooks(): Promise<User[]> {
  const token = await getSession()
  const res = await fetch(`${BACKEND_URL}/members/with_overdue_books`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch overdue members')
  return res.json()
}

export type ActionState = { error?: string; success?: boolean } | undefined

async function errorFrom(res: Response): Promise<ActionState> {
  const data = await res.json().catch(() => ({}))
  const messages = (data.errors ?? data.error) as string | string[] | undefined
  const text = Array.isArray(messages) ? messages.join('. ') : messages
  return { error: text ?? 'Something went wrong.' }
}

export async function createBook(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
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

  if (!res.ok) return errorFrom(res)

  revalidatePath('/librarian/books')
  return { success: true }
}

export async function updateBook(
  id: number,
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
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

  if (!res.ok) return errorFrom(res)

  revalidatePath('/librarian/books')
  return { success: true }
}

export async function returnBorrowing(
  bookId: number,
  borrowingId: number
): Promise<ActionState> {
  const token = await getSession()

  const res = await fetch(`${BACKEND_URL}/books/${bookId}/borrowings/${borrowingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ returned_at: new Date().toISOString() }),
  })

  if (!res.ok) return errorFrom(res)

  revalidatePath(`/librarian/books/${bookId}`)
  revalidatePath('/member')
  return { success: true }
}

export async function createBorrowing(bookId: number): Promise<ActionState> {
  const token = await getSession()

  const res = await fetch(`${BACKEND_URL}/books/${bookId}/borrowings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) return errorFrom(res)

  revalidatePath('/member/books')
  revalidatePath('/member')
  return { success: true }
}

export async function deleteBook(id: number): Promise<ActionState> {
  const token = await getSession()

  const res = await fetch(`${BACKEND_URL}/books/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) return errorFrom(res)

  revalidatePath('/librarian/books')
  return { success: true }
}
