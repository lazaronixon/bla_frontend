import { render, screen } from '@testing-library/react'
import { NewBookForm } from '@/app/(home)/books/new/new-book-form'
import { toast } from 'sonner'

jest.mock('sonner', () => ({ toast: { error: jest.fn() } }))

jest.mock('@/app/actions/books', () => ({
  createBook: jest.fn(),
}))

const mockUseActionState = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (...args: unknown[]) => mockUseActionState(...args),
}))

describe('NewBookForm', () => {
  beforeEach(() => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), false])
  })

  it('renders all fields', () => {
    render(<NewBookForm />)
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Author')).toBeInTheDocument()
    expect(screen.getByLabelText('Genre')).toBeInTheDocument()
    expect(screen.getByLabelText('ISBN')).toBeInTheDocument()
    expect(screen.getByLabelText('Copies')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<NewBookForm />)
    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument()
  })

  it('disables button and shows loading text while pending', () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), true])
    render(<NewBookForm />)
    expect(screen.getByRole('button', { name: /adding/i })).toBeDisabled()
  })

  it('calls toast.error when state has an error', () => {
    mockUseActionState.mockReturnValue([{ error: 'Something went wrong.' }, jest.fn(), false])
    render(<NewBookForm />)
    expect(toast.error).toHaveBeenCalledWith('Something went wrong.')
  })

  it('calls onSuccess when state is successful', () => {
    const onSuccess = jest.fn()
    mockUseActionState.mockReturnValue([{ success: true }, jest.fn(), false])
    render(<NewBookForm onSuccess={onSuccess} />)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('copies input has type number with min 1 and default 1', () => {
    render(<NewBookForm />)
    const input = screen.getByLabelText('Copies')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveValue(1)
  })
})
