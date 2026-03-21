import { render, screen, fireEvent, act } from '@testing-library/react'
import { BooksToolbar } from '@/app/(home)/books/books-toolbar'

const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

jest.mock('@/app/(home)/books/new/new-book-form', () => ({
  NewBookForm: () => <div data-testid="new-book-form" />,
}))

describe('BooksToolbar', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the search input', () => {
    render(<BooksToolbar />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('populates input with initialQuery', () => {
    render(<BooksToolbar initialQuery="dune" />)
    expect(screen.getByRole('textbox')).toHaveValue('dune')
  })

  it('shows clear button when input has a value', () => {
    render(<BooksToolbar initialQuery="dune" />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('hides clear button when input is empty', () => {
    render(<BooksToolbar />)
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
  })

  it('calls router.replace with query after debounce', () => {
    render(<BooksToolbar />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'dune' } })
    act(() => jest.advanceTimersByTime(300))
    expect(mockReplace).toHaveBeenCalledWith('/books?q=dune')
  })

  it('calls router.replace with no query when input is cleared', () => {
    render(<BooksToolbar initialQuery="dune" />)
    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(mockReplace).toHaveBeenCalledWith('/books')
  })

  it('renders the New Book button', () => {
    render(<BooksToolbar />)
    expect(screen.getByRole('button', { name: /new book/i })).toBeInTheDocument()
  })
})
