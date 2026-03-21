import { render, screen } from '@testing-library/react'
import SignInPage from '@/app/sign-in/page'

jest.mock('@/app/sign-in/sign-in-form', () => ({
  SignInForm: () => <div data-testid="sign-in-form" />,
}))

describe('SignInPage', () => {
  it('renders the sign-in form', () => {
    render(<SignInPage />)
    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument()
  })
})
