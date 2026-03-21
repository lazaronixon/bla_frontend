import { render, screen } from '@testing-library/react'
import { BorrowingsButton } from '@/app/(home)/books/show-button'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('BorrowingsButton', () => {
  it('renders a link to the correct book path', () => {
    render(<BorrowingsButton id={5} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/books/5')
  })

  it('renders the button text', () => {
    render(<BorrowingsButton id={5} />)
    expect(screen.getByText('Borrowings')).toBeInTheDocument()
  })
})
