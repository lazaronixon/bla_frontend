import { render, screen, fireEvent } from '@testing-library/react'
import { ReturnButton } from '@/app/librarian/books/[id]/return-button'

const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

jest.mock('@/app/actions/books', () => ({
  returnBorrowing: jest.fn(),
}))

import { returnBorrowing } from '@/app/actions/books'

const mockedReturnBorrowing = returnBorrowing as jest.MockedFunction<typeof returnBorrowing>

describe('ReturnButton', () => {
  beforeEach(() => {
    mockRefresh.mockClear()
    mockedReturnBorrowing.mockClear()
  })

  it('renders the return button', () => {
    render(<ReturnButton bookId={1} borrowingId={10} />)
    expect(screen.getByRole('button', { name: /^return$/i })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<ReturnButton bookId={1} borrowingId={10} disabled />)
    expect(screen.getByRole('button', { name: /^return$/i })).toBeDisabled()
  })

  it('is enabled by default', () => {
    render(<ReturnButton bookId={1} borrowingId={10} />)
    expect(screen.getByRole('button', { name: /^return$/i })).toBeEnabled()
  })

  it('does not show the confirmation dialog before clicking', () => {
    render(<ReturnButton bookId={1} borrowingId={10} />)
    expect(screen.queryByText(/mark as returned/i)).not.toBeInTheDocument()
  })

  it('shows the confirmation dialog after clicking Return', () => {
    render(<ReturnButton bookId={1} borrowingId={10} />)
    fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
    expect(screen.getByText(/mark as returned/i)).toBeInTheDocument()
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('closes the dialog when Cancel is clicked', () => {
    render(<ReturnButton bookId={1} borrowingId={10} />)
    fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/mark as returned/i)).not.toBeInTheDocument()
  })

  it('does not call returnBorrowing when Cancel is clicked', () => {
    render(<ReturnButton bookId={1} borrowingId={10} />)
    fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockedReturnBorrowing).not.toHaveBeenCalled()
  })

  it('calls returnBorrowing with the correct ids on confirm', async () => {
    mockedReturnBorrowing.mockResolvedValue({ success: true })
    render(<ReturnButton bookId={3} borrowingId={42} />)
    fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await screen.findByRole('button', { name: /^return$/i })
    expect(mockedReturnBorrowing).toHaveBeenCalledWith(3, 42)
  })

  it('closes the dialog and refreshes after successful return', async () => {
    mockedReturnBorrowing.mockResolvedValue({ success: true })
    render(<ReturnButton bookId={1} borrowingId={10} />)
    fireEvent.click(screen.getByRole('button', { name: /^return$/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await screen.findByRole('button', { name: /^return$/i })
    expect(mockRefresh).toHaveBeenCalled()
    expect(screen.queryByText(/mark as returned/i)).not.toBeInTheDocument()
  })
})
