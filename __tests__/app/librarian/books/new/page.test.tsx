import { render, screen } from '@testing-library/react'
import NewBookPage from '@/app/librarian/books/new/page'

jest.mock('@/app/librarian/books/new/new-book-form', () => ({
  NewBookForm: () => <div data-testid="new-book-form" />,
}))

describe('NewBookPage', () => {
  it('renders the heading and form', async () => {
    render(await NewBookPage())
    expect(screen.getByRole('heading', { name: 'New Book' })).toBeInTheDocument()
    expect(screen.getByTestId('new-book-form')).toBeInTheDocument()
  })
})
