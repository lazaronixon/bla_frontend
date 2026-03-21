import { render, screen, fireEvent } from '@testing-library/react'
import { EditBookButton } from '@/app/librarian/books/edit-book-button'

const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

jest.mock('@/app/librarian/books/edit/edit-book-form', () => ({
  EditBookForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid="edit-book-form">
      <button onClick={onSuccess}>submit</button>
    </div>
  ),
}))

const book = { id: 7, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3 }

describe('EditBookButton', () => {
  beforeEach(() => {
    mockRefresh.mockClear()
  })

  it('renders the edit button', () => {
    render(<EditBookButton book={book} />)
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('does not show the form before the button is clicked', () => {
    render(<EditBookButton book={book} />)
    expect(screen.queryByTestId('edit-book-form')).not.toBeInTheDocument()
  })

  it('shows the form after clicking the edit button', () => {
    render(<EditBookButton book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByTestId('edit-book-form')).toBeInTheDocument()
  })

  it('calls router.refresh and closes the dialog on success', () => {
    render(<EditBookButton book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(mockRefresh).toHaveBeenCalled()
    expect(screen.queryByTestId('edit-book-form')).not.toBeInTheDocument()
  })
})
