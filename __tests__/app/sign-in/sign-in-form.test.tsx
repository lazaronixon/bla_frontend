import { render, screen } from '@testing-library/react'
import { SignInForm } from '@/app/sign-in/sign-in-form'
import { toast } from 'sonner'

jest.mock('sonner', () => ({ toast: { error: jest.fn() } }))

jest.mock('@/app/actions/auth', () => ({
  signIn: jest.fn(),
}))

const mockUseActionState = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (...args: unknown[]) => mockUseActionState(...args),
}))

describe('SignInForm', () => {
  beforeEach(() => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), false])
  })

  it('renders email and password fields', () => {
    render(<SignInForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders the sign in button', () => {
    render(<SignInForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('disables button and shows loading text while pending', () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), true])
    render(<SignInForm />)
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('calls toast.error when state has an error', () => {
    mockUseActionState.mockReturnValue([{ error: 'Invalid email or password.' }, jest.fn(), false])
    render(<SignInForm />)
    expect(toast.error).toHaveBeenCalledWith('Invalid email or password.')
  })

  it('email input has correct type and autocomplete', () => {
    render(<SignInForm />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('password input has correct type and autocomplete', () => {
    render(<SignInForm />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('autocomplete', 'current-password')
  })

  it('renders a link to sign up', () => {
    render(<SignInForm />)
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/sign-up')
  })
})
