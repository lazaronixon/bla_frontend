import { render, screen } from '@testing-library/react'
import BooksPage from '@/app/librarian/books/page'

jest.mock('@/app/actions/books', () => ({
  getBooks: jest.fn(),
}))

jest.mock('@/app/librarian/books/books-toolbar', () => ({
  BooksToolbar: ({ initialQuery }: { initialQuery?: string }) => (
    <div data-testid="books-toolbar" data-query={initialQuery ?? ''} />
  ),
}))

jest.mock('@/app/librarian/books/book-actions-menu', () => ({
  BookActionsMenu: ({ book }: { book: { id: number } }) => (
    <div data-testid="book-actions-menu" data-book-id={book.id} />
  ),
}))

import { getBooks } from '@/app/actions/books'

const mockGetBooks = getBooks as jest.Mock

const books = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 },
  { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopia', isbn: '978-0451524935', copies: 5 },
]

function mockApi(bookList = books) {
  mockGetBooks.mockResolvedValue(bookList)
}

async function renderPage(searchParams: Record<string, string> = {}) {
  const jsx = await BooksPage({ searchParams: Promise.resolve(searchParams) })
  return render(jsx)
}

describe('BooksPage', () => {
  beforeEach(() => {
    mockApi()
  })

  it('renders book rows for a librarian', async () => {
    await renderPage()
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
    expect(screen.getByText('1984')).toBeInTheDocument()
    expect(screen.getByText('George Orwell')).toBeInTheDocument()
  })

  it('passes ?q= to getBooks when query param is set', async () => {
    await renderPage({ q: 'dune' })
    expect(mockGetBooks).toHaveBeenCalledWith('dune')
  })

  it('passes query to toolbar', async () => {
    await renderPage({ q: 'dune' })
    expect(screen.getByTestId('books-toolbar')).toHaveAttribute('data-query', 'dune')
  })

  it('passes empty query to toolbar when no search param', async () => {
    await renderPage()
    expect(screen.getByTestId('books-toolbar')).toHaveAttribute('data-query', '')
  })

  it('renders empty table when API returns no books', async () => {
    mockApi([])
    await renderPage()
    expect(screen.queryByRole('row', { name: /dune/i })).not.toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders an actions menu for each book', async () => {
    await renderPage()
    const menus = screen.getAllByTestId('book-actions-menu')
    expect(menus).toHaveLength(books.length)
  })

  it('passes the correct book id to each actions menu', async () => {
    await renderPage()
    const menus = screen.getAllByTestId('book-actions-menu')
    expect(menus[0]).toHaveAttribute('data-book-id', '1')
    expect(menus[1]).toHaveAttribute('data-book-id', '2')
  })

  it('renders footer with total copies', async () => {
    await renderPage()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders footer with total book count', async () => {
    await renderPage()
    expect(screen.getByText('2 books')).toBeInTheDocument()
  })

  it('renders singular book count in footer', async () => {
    mockApi([books[0]])
    await renderPage()
    expect(screen.getByText('1 book')).toBeInTheDocument()
  })

  it('renders # prefixed book ids', async () => {
    await renderPage()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
  })
})
