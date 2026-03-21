import { render, screen } from '@testing-library/react'
import BooksPage from '@/app/(dashboard)/books/page'
import { BACKEND_URL } from '@/lib/config'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/app/(dashboard)/books/books-toolbar', () => ({
  BooksToolbar: ({ initialQuery }: { initialQuery?: string }) => (
    <div data-testid="books-toolbar" data-query={initialQuery ?? ''} />
  ),
}))

import { getSession } from '@/lib/session'

const mockGetSession = getSession as jest.Mock

const librarianUser = { id: 1, email_address: 'lib@example.com', role: 'librarian' }
const memberUser = { id: 2, email_address: 'member@example.com', role: 'member' }

const books = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 },
  { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopia', isbn: '978-0451524935', copies: 5 },
]

function mockFetch(user: object | null, bookList = books) {
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes('/my/user')) {
      if (!user) return Promise.resolve({ ok: false, json: async () => ({}) })
      return Promise.resolve({ ok: true, json: async () => user })
    }
    if (url.includes('/books')) {
      return Promise.resolve({ ok: true, json: async () => bookList })
    }
    return Promise.resolve({ ok: false, json: async () => ({}) })
  })
}

async function renderPage(searchParams: Record<string, string> = {}) {
  const jsx = await BooksPage({ searchParams: Promise.resolve(searchParams) })
  return render(jsx)
}

describe('BooksPage', () => {
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

  it('renders book rows for a librarian', async () => {
    mockFetch(librarianUser)
    await renderPage()
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
    expect(screen.getByText('1984')).toBeInTheDocument()
    expect(screen.getByText('George Orwell')).toBeInTheDocument()
  })

  it('passes ?q= to the API when query param is set', async () => {
    mockFetch(librarianUser)
    await renderPage({ q: 'dune' })
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/books?q=dune`,
      expect.any(Object)
    )
  })

  it('passes query to toolbar', async () => {
    mockFetch(librarianUser)
    await renderPage({ q: 'dune' })
    expect(screen.getByTestId('books-toolbar')).toHaveAttribute('data-query', 'dune')
  })

  it('passes empty query to toolbar when no search param', async () => {
    mockFetch(librarianUser)
    await renderPage()
    expect(screen.getByTestId('books-toolbar')).toHaveAttribute('data-query', '')
  })

  it('renders empty table when API returns no books', async () => {
    mockFetch(librarianUser, [])
    await renderPage()
    expect(screen.queryByRole('row', { name: /dune/i })).not.toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
