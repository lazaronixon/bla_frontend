import { render, screen } from '@testing-library/react'
import NewBookPage from '@/app/(home)/books/new/page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/app/(home)/books/new/new-book-form', () => ({
  NewBookForm: () => <div data-testid="new-book-form" />,
}))

import { getSession } from '@/lib/session'

const mockGetSession = getSession as jest.Mock

const librarianUser = { id: 1, email_address: 'lib@example.com', role: 'librarian' }
const memberUser = { id: 2, email_address: 'member@example.com', role: 'member' }

function mockFetch(user: object | null) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: !!user,
    json: async () => user ?? {},
  })
}

describe('NewBookPage', () => {
  beforeEach(() => {
    mockGetSession.mockResolvedValue('test-token')
  })

  it('redirects to /sign-in when no session', async () => {
    mockGetSession.mockResolvedValue(undefined)
    mockFetch(null)
    await expect(NewBookPage()).rejects.toThrow('NEXT_REDIRECT:/sign-in')
  })

  it('redirects to / when user is a member', async () => {
    mockFetch(memberUser)
    await expect(NewBookPage()).rejects.toThrow('NEXT_REDIRECT:/')
  })

  it('renders the heading and form for a librarian', async () => {
    mockFetch(librarianUser)
    render(await NewBookPage())
    expect(screen.getByRole('heading', { name: 'New Book' })).toBeInTheDocument()
    expect(screen.getByTestId('new-book-form')).toBeInTheDocument()
  })
})
