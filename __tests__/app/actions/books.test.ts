import { createBook, updateBook } from '@/app/actions/books'
import { BACKEND_URL } from '@/lib/config'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

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

  it('redirects to /sign-in when no session', async () => {
    mockGetSession.mockResolvedValue(undefined)
    await expect(createBook(undefined, makeFormData(validBook))).rejects.toThrow('NEXT_REDIRECT:/sign-in')
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
    expect(mockRevalidatePath).toHaveBeenCalledWith('/books')
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

  it('redirects to /sign-in when no session', async () => {
    mockGetSession.mockResolvedValue(undefined)
    await expect(updateBook(1, undefined, makeFormData(validBook))).rejects.toThrow('NEXT_REDIRECT:/sign-in')
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
    expect(mockRevalidatePath).toHaveBeenCalledWith('/books')
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
