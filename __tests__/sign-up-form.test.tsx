import { render, screen } from '@testing-library/react'
import { SignUpForm } from '@/app/sign-up/sign-up-form'

jest.mock('@/app/actions/auth', () => ({
  signUp: jest.fn(),
}))

const mockUseActionState = jest.fn()
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (...args: unknown[]) => mockUseActionState(...args),
}))

describe('SignUpForm', () => {
  beforeEach(() => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), false])
  })

  it('renders email, password, and confirm password fields', () => {
    render(<SignUpForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
  })

  it('renders the create account button', () => {
    render(<SignUpForm />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('disables the button and shows loading text while pending', () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), true])
    render(<SignUpForm />)
    const button = screen.getByRole('button', { name: /creating account/i })
    expect(button).toBeDisabled()
  })

  it('does not render an error alert initially', () => {
    render(<SignUpForm />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the error message in an alert when state has an error', () => {
    mockUseActionState.mockReturnValue([
      { error: 'Email address has already been taken.' },
      jest.fn(),
      false,
    ])
    render(<SignUpForm />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Email address has already been taken.')).toBeInTheDocument()
  })

  it('email input has correct type and autocomplete', () => {
    render(<SignUpForm />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('password inputs have correct type and autocomplete', () => {
    render(<SignUpForm />)
    const password = screen.getByLabelText('Password')
    const confirmation = screen.getByLabelText('Confirm password')
    expect(password).toHaveAttribute('type', 'password')
    expect(password).toHaveAttribute('autocomplete', 'new-password')
    expect(confirmation).toHaveAttribute('type', 'password')
    expect(confirmation).toHaveAttribute('autocomplete', 'new-password')
  })

  it('renders a link to sign in', () => {
    render(<SignUpForm />)
    const link = screen.getByRole('link', { name: /sign in/i })
    expect(link).toHaveAttribute('href', '/sign-in')
  })
})
