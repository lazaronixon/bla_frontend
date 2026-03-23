import { createBook, updateBook, returnBorrowing, getDashboardStats, getMembersWithOverdueBooks, getCurrentUser } from '@/app/actions/books'
import { BACKEND_URL } from '@/lib/config'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}))

import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

const mockGetSession = getSession as jest.Mock
const mockRevalidatePath = revalidatePath as jest.Mock

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
  return fd
}

const validBook = { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: '3' }

describe('createBook', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('posts to /books with auth header and correct body', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    await createBook(undefined, makeFormData(validBook))
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/books`, expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      body: JSON.stringify({ title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 }),
    }))
  })

  it('returns success and revalidates /books on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    const result = await createBook(undefined, makeFormData(validBook))
    expect(result).toEqual({ success: true })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/librarian/books')
  })

  it('returns error messages from API on 422', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Title is too short', 'ISBN is invalid'] }),
    })
    const result = await createBook(undefined, makeFormData(validBook))
    expect(result).toEqual({ error: 'Title is too short. ISBN is invalid' })
  })

  it('returns generic error when no errors in body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
    const result = await createBook(undefined, makeFormData(validBook))
    expect(result).toEqual({ error: 'Something went wrong.' })
  })
})

describe('updateBook', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('patches /books/:id with auth header and correct body', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    await updateBook(42, undefined, makeFormData(validBook))
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/books/42`, expect.objectContaining({
      method: 'PATCH',
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      body: JSON.stringify({ title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 }),
    }))
  })

  it('returns success and revalidates /books on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    const result = await updateBook(1, undefined, makeFormData(validBook))
    expect(result).toEqual({ success: true })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/librarian/books')
  })

  it('returns error messages from API on 422', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Title is too short', 'ISBN is invalid'] }),
    })
    const result = await updateBook(1, undefined, makeFormData(validBook))
    expect(result).toEqual({ error: 'Title is too short. ISBN is invalid' })
  })

  it('returns generic error when no errors in body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
    const result = await updateBook(1, undefined, makeFormData(validBook))
    expect(result).toEqual({ error: 'Something went wrong.' })
  })
})

describe('getDashboardStats', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('fetches /books/total with auth header', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ total_books: 10, total_borrowed: 3, total_due_today: 1 }) })
    await getDashboardStats()
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/books/total`, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    }))
  })

  it('returns parsed stats on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ total_books: 10, total_borrowed: 3, total_due_today: 1 }) })
    const result = await getDashboardStats()
    expect(result).toEqual({ total_books: 10, total_borrowed: 3, total_due_today: 1 })
  })

  it('throws on non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false })
    await expect(getDashboardStats()).rejects.toThrow('Failed to fetch dashboard stats')
  })
})

describe('getMembersWithOverdueBooks', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('fetches /members/with_overdue_books with auth header', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] })
    await getMembersWithOverdueBooks()
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/members/with_overdue_books`, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    }))
  })

  it('returns parsed members on success', async () => {
    const members = [{ id: 1, email_address: 'late@example.com', role: 'member' }]
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => members })
    const result = await getMembersWithOverdueBooks()
    expect(result).toEqual(members)
  })

  it('throws on non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false })
    await expect(getMembersWithOverdueBooks()).rejects.toThrow('Failed to fetch overdue members')
  })
})

describe('getCurrentUser', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('fetches /my/user with auth header', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1, email_address: 'user@example.com', role: 'librarian' }) })
    await getCurrentUser()
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/my/user`, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    }))
  })

  it('returns the user on success', async () => {
    const user = { id: 1, email_address: 'user@example.com', role: 'librarian' }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => user })
    const result = await getCurrentUser()
    expect(result).toEqual(user)
  })

  it('returns null on non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false })
    const result = await getCurrentUser()
    expect(result).toBeNull()
  })
})

describe('returnBorrowing', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('patches the correct borrowing URL with auth header', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    await returnBorrowing(3, 42)
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/books/3/borrowings/42`,
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    )
  })

  it('sends returned_at in the request body', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    await returnBorrowing(1, 10)
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
    expect(body).toHaveProperty('returned_at')
    expect(typeof body.returned_at).toBe('string')
  })

  it('returns success and revalidates the book path', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    const result = await returnBorrowing(3, 10)
    expect(result).toEqual({ success: true })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/librarian/books/3')
  })

  it('returns error messages from API on failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Already returned'] }),
    })
    const result = await returnBorrowing(1, 10)
    expect(result).toEqual({ error: 'Already returned' })
  })

  it('returns generic error when no errors in body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
    const result = await returnBorrowing(1, 10)
    expect(result).toEqual({ error: 'Something went wrong.' })
  })
})
