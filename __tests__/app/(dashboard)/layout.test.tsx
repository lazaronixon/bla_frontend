import { render, screen } from '@testing-library/react'
import DashboardLayout from '@/app/(dashboard)/layout'

jest.mock('@/components/dashboard/sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}))

describe('DashboardLayout', () => {
  it('renders children', () => {
    render(<DashboardLayout><p>content</p></DashboardLayout>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the sidebar', () => {
    render(<DashboardLayout><p>content</p></DashboardLayout>)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
