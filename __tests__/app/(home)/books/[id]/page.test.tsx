import { render, screen } from '@testing-library/react'
import BookBorrowingsPage from '@/app/(home)/books/[id]/page'
import { BACKEND_URL } from '@/lib/config'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}))

import { getSession } from '@/lib/session'

const mockGetSession = getSession as jest.Mock

const librarianUser = { id: 1, email_address: 'lib@example.com', role: 'librarian' }
const memberUser = { id: 2, email_address: 'member@example.com', role: 'member' }

const book = {
  id: 1,
  title: 'Dune',
  author: 'Frank Herbert',
  genre: 'Sci-Fi',
  isbn: '978-0441013593',
  copies: 3,
}

const borrowings = [
  {
    id: 10,
    due_at: '2026-04-01T00:00:00Z',
    returned_at: null,
    created_at: '2026-03-01T00:00:00Z',
    user: { id: 2, email_address: 'member@example.com', role: 'member' },
  },
  {
    id: 11,
    due_at: '2026-03-15T00:00:00Z',
    returned_at: '2026-03-10T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    user: { id: 3, email_address: 'other@example.com', role: 'member' },
  },
]

function mockFetch(
  user: object | null,
  bookData: object | null = book,
  borrowingList = borrowings
) {
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes('/my/user')) {
      if (!user) return Promise.resolve({ ok: false, json: async () => ({}) })
      return Promise.resolve({ ok: true, json: async () => user })
    }
    if (url.includes('/borrowings')) {
      return Promise.resolve({ ok: true, json: async () => borrowingList })
    }
    if (/\/books\/\d+$/.test(url)) {
      if (!bookData) return Promise.resolve({ ok: false, status: 404, json: async () => ({}) })
      return Promise.resolve({ ok: true, json: async () => bookData })
    }
    return Promise.resolve({ ok: false, json: async () => ({}) })
  })
}

async function renderPage(id = '1') {
  const jsx = await BookBorrowingsPage({ params: Promise.resolve({ id }) })
  return render(jsx)
}

describe('BookBorrowingsPage', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('redirects to /sign-in when no session', async () => {
    mockGetSession.mockResolvedValue(undefined)
    mockFetch(null)
    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT:/sign-in')
  })

  it('redirects to / when user is a member', async () => {
    mockFetch(memberUser)
    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT:/')
  })

  it('throws notFound when book does not exist', async () => {
    mockFetch(librarianUser, null)
    await expect(renderPage('999')).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('renders the book title and author', async () => {
    mockFetch(librarianUser)
    await renderPage()
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
  })

  it('renders book metadata', async () => {
    mockFetch(librarianUser)
    await renderPage()
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
    expect(screen.getByText('978-0441013593')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders a row for each borrowing', async () => {
    mockFetch(librarianUser)
    await renderPage()
    expect(screen.getByText('member@example.com')).toBeInTheDocument()
    expect(screen.getByText('other@example.com')).toBeInTheDocument()
  })

  it('shows — for an unreturned borrowing', async () => {
    mockFetch(librarianUser)
    await renderPage()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows "No borrowings yet." when there are none', async () => {
    mockFetch(librarianUser, book, [])
    await renderPage()
    expect(screen.getByText(/no borrowings yet/i)).toBeInTheDocument()
  })

  it('fetches the book with the correct id', async () => {
    mockFetch(librarianUser)
    await renderPage('42')
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/books/42`,
      expect.any(Object)
    )
  })

  it('fetches borrowings with the correct book id', async () => {
    mockFetch(librarianUser)
    await renderPage('42')
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/books/42/borrowings`,
      expect.any(Object)
    )
  })
})
