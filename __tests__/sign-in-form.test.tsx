import { render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import { SignInForm } from '@/app/sign-in/sign-in-form'

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

  it('does not call toast.error initially', () => {
    render(<SignInForm />)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('calls toast.error when state has an error', () => {
    mockUseActionState.mockReturnValue([
      { error: 'Invalid email or password.' },
      jest.fn(),
      false,
    ])

    render(<SignInForm />)
    expect(toast.error).toHaveBeenCalledWith('Invalid email or password.')
  })

  it('disables the button and shows loading text while pending', () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), true])

    render(<SignInForm />)
    const button = screen.getByRole('button', { name: /signing in/i })
    expect(button).toBeDisabled()
  })

  it('email input has correct type and autocomplete', () => {
    render(<SignInForm />)
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('autocomplete', 'email')
  })

  it('password input has correct type and autocomplete', () => {
    render(<SignInForm />)
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })
})
