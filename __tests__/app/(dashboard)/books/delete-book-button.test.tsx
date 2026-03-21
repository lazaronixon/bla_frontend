import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteBookButton } from '@/app/(dashboard)/books/delete-book-button'

const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

jest.mock('@/app/actions/books', () => ({
  deleteBook: jest.fn(),
}))

import { deleteBook } from '@/app/actions/books'

const mockedDeleteBook = deleteBook as jest.MockedFunction<typeof deleteBook>

describe('DeleteBookButton', () => {
  beforeEach(() => {
    mockRefresh.mockClear()
    mockedDeleteBook.mockClear()
  })

  it('renders the delete button', () => {
    render(<DeleteBookButton id={1} title="Dune" />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('does not show the confirmation dialog before the button is clicked', () => {
    render(<DeleteBookButton id={1} title="Dune" />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument()
  })

  it('shows a confirmation dialog after clicking the delete button', () => {
    render(<DeleteBookButton id={1} title="Dune" />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
    expect(screen.getByText(/Dune/)).toBeInTheDocument()
  })

  it('closes the dialog when cancel is clicked', () => {
    render(<DeleteBookButton id={1} title="Dune" />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/cannot be undone/i)).not.toBeInTheDocument()
  })

  it('calls deleteBook and refreshes on confirm', async () => {
    mockedDeleteBook.mockResolvedValue({ success: true })
    render(<DeleteBookButton id={7} title="Dune" />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    await screen.findByRole('button', { name: /delete/i })
    expect(mockedDeleteBook).toHaveBeenCalledWith(7)
    expect(mockRefresh).toHaveBeenCalled()
  })
})
