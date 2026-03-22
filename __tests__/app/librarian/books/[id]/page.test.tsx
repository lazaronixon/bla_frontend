import { render, screen } from '@testing-library/react'
import BookBorrowingsPage from '@/app/librarian/books/[id]/page'

jest.mock('@/app/actions/books', () => ({
  getBook: jest.fn(),
  getBorrowings: jest.fn(),
}))

jest.mock('@/components/due-cell', () => ({
  DueCell: ({ dueAt }: { dueAt: string }) => <span data-testid="due-cell">{dueAt}</span>,
}))

jest.mock('@/app/librarian/books/[id]/return-button', () => ({
  ReturnButton: ({ borrowingId, disabled }: { borrowingId: number; disabled?: boolean }) => (
    <button data-testid="return-button" data-borrowing-id={borrowingId} disabled={disabled}>Return</button>
  ),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import { getBook, getBorrowings } from '@/app/actions/books'

const mockGetBook = getBook as jest.Mock
const mockGetBorrowings = getBorrowings as jest.Mock

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

function mockApi(bookData: object | null = book, borrowingList = borrowings) {
  mockGetBook.mockResolvedValue(bookData)
  mockGetBorrowings.mockResolvedValue(borrowingList)
}

async function renderPage(id = '1') {
  const jsx = await BookBorrowingsPage({ params: Promise.resolve({ id }) })
  return render(jsx)
}

describe('BookBorrowingsPage', () => {
  beforeEach(() => {
    mockApi()
  })

  it('throws notFound when book does not exist', async () => {
    mockApi(null)
    await expect(renderPage('999')).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('renders the book title and author', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument()
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
  })

  it('renders book metadata', async () => {
    await renderPage()
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
    expect(screen.getByText('978-0441013593')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders a row for each borrowing', async () => {
    await renderPage()
    expect(screen.getByText('member@example.com')).toBeInTheDocument()
    expect(screen.getByText('other@example.com')).toBeInTheDocument()
  })

  it('shows — for an unreturned borrowing', async () => {
    await renderPage()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows "No borrowings yet." when there are none', async () => {
    mockApi(book, [])
    await renderPage()
    expect(screen.getByText(/no borrowings yet/i)).toBeInTheDocument()
  })

  it('fetches the book with the correct id', async () => {
    await renderPage('42')
    expect(mockGetBook).toHaveBeenCalledWith('42')
  })

  it('fetches borrowings with the correct book id', async () => {
    await renderPage('42')
    expect(mockGetBorrowings).toHaveBeenCalledWith('42')
  })

  it('renders a return button for every borrowing', async () => {
    await renderPage()
    expect(screen.getAllByTestId('return-button')).toHaveLength(2)
  })

  it('enables the return button for unreturned borrowings', async () => {
    await renderPage()
    const buttons = screen.getAllByTestId('return-button')
    const unreturned = buttons.find((b) => b.getAttribute('data-borrowing-id') === '10')
    expect(unreturned).toBeEnabled()
  })

  it('disables the return button for already returned borrowings', async () => {
    await renderPage()
    const buttons = screen.getAllByTestId('return-button')
    const returned = buttons.find((b) => b.getAttribute('data-borrowing-id') === '11')
    expect(returned).toBeDisabled()
  })

  it('renders footer with total borrowing count', async () => {
    await renderPage()
    expect(screen.getByText('2 borrowings')).toBeInTheDocument()
  })

  it('renders singular borrowing count in footer', async () => {
    mockApi(book, [borrowings[0]])
    await renderPage()
    expect(screen.getByText('1 borrowing')).toBeInTheDocument()
  })
})
