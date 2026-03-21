import { render, screen, fireEvent } from '@testing-library/react'
import { BookActionsMenu } from '@/app/librarian/books/book-actions-menu'

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

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onSelect,
  }: {
    children: React.ReactNode
    onSelect?: () => void
  }) => <button onClick={onSelect}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
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
  })

  it('renders Show, Edit, and Delete items', () => {
    render(<BookActionsMenu book={book} />)
    expect(screen.getByText('Show')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('navigates to the book page when Show is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Show'))
    expect(mockPush).toHaveBeenCalledWith('/librarian/books/1')
  })

  it('opens the edit dialog when Edit is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByTestId('edit-book-form')).toBeInTheDocument()
  })

  it('closes the edit dialog and refreshes on success', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Edit'))
    fireEvent.click(screen.getByText('Save'))
    expect(mockRefresh).toHaveBeenCalled()
    expect(screen.queryByTestId('edit-book-form')).not.toBeInTheDocument()
  })

  it('opens the delete dialog when Delete is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
    expect(screen.getByText(/Dune/)).toBeInTheDocument()
  })

  it('closes the delete dialog when Cancel is clicked', () => {
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument()
  })

  it('calls deleteBook with the correct id on confirm', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    await screen.findByText('Show')
    expect(mockedDeleteBook).toHaveBeenCalledWith(1)
  })

  it('refreshes after successful delete', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    await screen.findByText('Show')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('closes the delete dialog after successful delete', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<BookActionsMenu book={book} />)
    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    await screen.findByText('Show')
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument()
  })
})
