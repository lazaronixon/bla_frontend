import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/member/page'

jest.mock('@/app/actions/books', () => ({
  getBorrowedBooks: jest.fn(),
}))

jest.mock('@/components/due-cell', () => ({
  DueCell: ({ dueAt }: { dueAt: string }) => <span data-testid="due-cell">{dueAt}</span>,
}))

import { getBorrowedBooks } from '@/app/actions/books'

const mockGetBorrowedBooks = getBorrowedBooks as jest.Mock

const borrowings = [
  {
    id: 10,
    due_at: '2026-04-01T00:00:00Z',
    returned_at: null,
    created_at: '2026-03-01T00:00:00Z',
    user: { id: 2, email_address: 'member@example.com', role: 'member' },
    book: { id: 1, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 },
  },
  {
    id: 11,
    due_at: '2026-03-15T00:00:00Z',
    returned_at: '2026-03-10T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    user: { id: 2, email_address: 'member@example.com', role: 'member' },
    book: { id: 2, title: 'Foundation', author: 'Isaac Asimov', genre: 'Sci-Fi', isbn: '978-0553293357', copies: 2 },
  },
]

async function renderPage() {
  const jsx = await DashboardPage()
  return render(jsx)
}

describe('DashboardPage', () => {
  beforeEach(() => {
    mockGetBorrowedBooks.mockResolvedValue(borrowings)
  })

  it('renders the dashboard heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders the welcome message', async () => {
    await renderPage()
    expect(screen.getByText('Welcome to BLA Library.')).toBeInTheDocument()
  })

  it('renders the borrowings heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'My Borrowings' })).toBeInTheDocument()
  })

  it('renders a row for each borrowing', async () => {
    await renderPage()
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('Foundation')).toBeInTheDocument()
  })

  it('renders book authors', async () => {
    await renderPage()
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
    expect(screen.getByText('Isaac Asimov')).toBeInTheDocument()
  })

  it('shows — for an unreturned borrowing', async () => {
    await renderPage()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows "No borrowings yet." when there are none', async () => {
    mockGetBorrowedBooks.mockResolvedValue([])
    await renderPage()
    expect(screen.getByText(/no borrowings yet/i)).toBeInTheDocument()
  })

  it('renders a due cell for each borrowing', async () => {
    await renderPage()
    expect(screen.getAllByTestId('due-cell')).toHaveLength(2)
  })
})
