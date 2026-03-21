import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/(home)/page'

describe('DashboardPage', () => {
  it('renders the dashboard heading', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Welcome to BLA Library.')).toBeInTheDocument()
  })
})
