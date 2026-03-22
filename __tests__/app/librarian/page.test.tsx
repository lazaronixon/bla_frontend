import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/librarian/page'

jest.mock('@/app/actions/books', () => ({
  getDashboardStats: jest.fn(),
  getDueToday: jest.fn(),
  getMembersWithOverdueBooks: jest.fn(),
}))

import { getDashboardStats, getDueToday, getMembersWithOverdueBooks } from '@/app/actions/books'

const mockGetDashboardStats = getDashboardStats as jest.Mock
const mockGetDueToday = getDueToday as jest.Mock
const mockGetMembersWithOverdueBooks = getMembersWithOverdueBooks as jest.Mock

const stats = { total_books: 42, total_borrowed: 7 }
const dueToday = [
  { id: 1, due_at: '2026-03-21T12:00:00Z', returned_at: null, created_at: '2026-03-07T12:00:00Z', user: { id: 10, email_address: 'alice@example.com', role: 'member' }, book: { id: 5, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 } },
]
const overdueMembers = [
  { id: 20, email_address: 'bob@example.com', role: 'member', created_at: '2025-01-01T00:00:00Z' },
]

function mockApi() {
  mockGetDashboardStats.mockResolvedValue(stats)
  mockGetDueToday.mockResolvedValue(dueToday)
  mockGetMembersWithOverdueBooks.mockResolvedValue(overdueMembers)
}

async function renderPage() {
  const jsx = await DashboardPage()
  return render(jsx)
}

describe('DashboardPage', () => {
  beforeEach(() => {
    mockApi()
  })

  it('renders the dashboard heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders total books stat', async () => {
    await renderPage()
    expect(screen.getByText('Total Books')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders total borrowed stat', async () => {
    await renderPage()
    expect(screen.getByText('Total Borrowed')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders due today section with book title and member email', async () => {
    await renderPage()
    expect(screen.getByText('Due Today')).toBeInTheDocument()
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('renders overdue members section with email', async () => {
    await renderPage()
    expect(screen.getByText('Members with Overdue Books')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('shows empty state when no books due today', async () => {
    mockGetDueToday.mockResolvedValue([])
    await renderPage()
    expect(screen.getByText('No books due today.')).toBeInTheDocument()
  })

  it('shows empty state when no overdue members', async () => {
    mockGetMembersWithOverdueBooks.mockResolvedValue([])
    await renderPage()
    expect(screen.getByText('No members with overdue books.')).toBeInTheDocument()
  })

  it('renders due today footer with total count', async () => {
    await renderPage()
    expect(screen.getByText('1 book')).toBeInTheDocument()
  })

  it('renders overdue members footer with total count', async () => {
    await renderPage()
    expect(screen.getByText('1 member')).toBeInTheDocument()
  })

  it('pluralizes due today footer when multiple books', async () => {
    mockGetDueToday.mockResolvedValue([dueToday[0], { ...dueToday[0], id: 2 }])
    await renderPage()
    expect(screen.getByText('2 books')).toBeInTheDocument()
  })

  it('pluralizes overdue members footer when multiple members', async () => {
    mockGetMembersWithOverdueBooks.mockResolvedValue([overdueMembers[0], { ...overdueMembers[0], id: 21 }])
    await renderPage()
    expect(screen.getByText('2 members')).toBeInTheDocument()
  })

  it('renders # prefixed book id in due today', async () => {
    await renderPage()
    expect(screen.getByText('#5')).toBeInTheDocument()
  })

  it('renders # prefixed member id in due today', async () => {
    await renderPage()
    expect(screen.getByText('#10')).toBeInTheDocument()
  })

  it('renders # prefixed member id in overdue members', async () => {
    await renderPage()
    expect(screen.getByText('#20')).toBeInTheDocument()
  })
})
