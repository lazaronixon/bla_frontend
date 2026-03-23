import { render, screen, fireEvent } from '@testing-library/react'
import { BookActionsMenu } from '@/app/librarian/books/book-actions-menu'
import { toast } from 'sonner'

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

jest.mock('@/app/actions/books', () => ({
  deleteBook: jest.fn(),
}))

jest.mock('@/app/librarian/books/edit/edit-book-form', () => ({
  EditBookForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid="edit-book-form">
      <button onClick={onSuccess}>Save</button>
    </div>
  ),
}))

import { deleteBook } from '@/app/actions/books'

const mockedDeleteBook = deleteBook as jest.MockedFunction<typeof deleteBook>

const book = {
  id: 1,
  title: 'Dune',
  author: 'Frank Herbert',
  genre: 'Sci-Fi',
  isbn: '978-0441013593',
  copies: 3,
}

describe('BookActionsMenu', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockRefresh.mockClear()
    mockedDeleteBook.mockClear()
    jest.mocked(toast.success).mockClear()
    jest.mocked(toast.error).mockClear()
  })

  it('renders Edit and Delete buttons', () => {
    render(<BookActionsMenu book={book} />)
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('opens the edit dialog when Edit is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByTestId('edit-book-form')).toBeInTheDocument()
  })

  it('closes the edit dialog and refreshes on success', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByText('Save'))
    expect(mockRefresh).toHaveBeenCalled()
    expect(screen.queryByTestId('edit-book-form')).not.toBeInTheDocument()
  })

  it('shows success toast after updating a book', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByText('Save'))
    expect(toast.success).toHaveBeenCalledWith('Book updated successfully')
  })

  it('opens the delete dialog when Delete is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
    expect(screen.getByText(/Dune/)).toBeInTheDocument()
  })

  it('closes the delete dialog when Cancel is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument()
  })

  it('calls deleteBook with the correct id on confirm', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    await screen.findByRole('button', { name: /edit/i })
    expect(mockedDeleteBook).toHaveBeenCalledWith(1)
  })

  it('refreshes after successful delete', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    await screen.findByRole('button', { name: /edit/i })
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('shows success toast after deleting a book', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    await screen.findByRole('button', { name: /edit/i })
    expect(toast.success).toHaveBeenCalledWith('Book deleted successfully')
  })

  it('closes the delete dialog after successful delete', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    const deleteButtons = screen.getAllByRole('button', { name: /^delete$/i })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    await screen.findByRole('button', { name: /edit/i })
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument()
  })
})
