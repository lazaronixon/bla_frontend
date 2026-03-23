import { render, screen } from '@testing-library/react'
import { EditBookForm } from '@/app/librarian/books/edit/edit-book-form'
import { toast } from 'sonner'

jest.mock('sonner', () => ({ toast: { error: jest.fn() } }))

jest.mock('@/app/actions/books', () => ({
  updateBook: jest.fn(),
}))

const mockUseActionState = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (...args: unknown[]) => mockUseActionState(...args),
}))

const book = { id: 7, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', isbn: '978-0441013593', copies: 3, available: 2 }

describe('EditBookForm', () => {
  beforeEach(() => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), false])
  })

  it('renders all fields', () => {
    render(<EditBookForm book={book} />)
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Author')).toBeInTheDocument()
    expect(screen.getByLabelText('Genre')).toBeInTheDocument()
    expect(screen.getByLabelText('ISBN')).toBeInTheDocument()
    expect(screen.getByLabelText('Copies')).toBeInTheDocument()
  })

  it('pre-fills fields with book data', () => {
    render(<EditBookForm book={book} />)
    expect(screen.getByLabelText('Title')).toHaveValue('Dune')
    expect(screen.getByLabelText('Author')).toHaveValue('Frank Herbert')
    expect(screen.getByLabelText('Genre')).toHaveValue('Sci-Fi')
    expect(screen.getByLabelText('ISBN')).toHaveValue('978-0441013593')
    expect(screen.getByLabelText('Copies')).toHaveValue(3)
  })

  it('renders the submit button', () => {
    render(<EditBookForm book={book} />)
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('disables button and shows loading text while pending', () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), true])
    render(<EditBookForm book={book} />)
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('calls toast.error when state has an error', () => {
    mockUseActionState.mockReturnValue([{ error: 'Something went wrong.' }, jest.fn(), false])
    render(<EditBookForm book={book} />)
    expect(toast.error).toHaveBeenCalledWith('Something went wrong.')
  })

  it('calls onSuccess when state is successful', () => {
    const onSuccess = jest.fn()
    mockUseActionState.mockReturnValue([{ success: true }, jest.fn(), false])
    render(<EditBookForm book={book} onSuccess={onSuccess} />)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('copies input has type number with min 1', () => {
    render(<EditBookForm book={book} />)
    const input = screen.getByLabelText('Copies')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('min', '1')
  })
})
