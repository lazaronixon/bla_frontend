import { render, screen } from '@testing-library/react'
import SignUpPage from '@/app/sign-up/page'

jest.mock('@/app/sign-up/sign-up-form', () => ({
  SignUpForm: () => <div data-testid="sign-up-form" />,
}))

describe('SignUpPage', () => {
  it('renders the sign-up form', () => {
    render(<SignUpPage />)
    expect(screen.getByTestId('sign-up-form')).toBeInTheDocument()
  })
})
