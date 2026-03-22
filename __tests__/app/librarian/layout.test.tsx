import { render, screen } from '@testing-library/react'
import DashboardLayout from '@/app/librarian/layout'

jest.mock('@/app/actions/auth', () => ({ signOut: jest.fn() }))
jest.mock('@/app/actions/books', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({ email_address: 'librarian@example.com' }),
}))
jest.mock('@/app/librarian/app-sidebar', () => ({
  AppSidebar: ({ user }: { user: { email_address: string } }) => (
    <div data-testid="sidebar" data-email={user.email_address} />
  ),
}))

jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarTrigger: () => null,
}))

jest.mock('@/components/app-breadcrumb', () => ({
  AppBreadcrumb: () => <nav data-testid="breadcrumb" />,
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: () => null,
}))

describe('DashboardLayout', () => {
  it('renders children', async () => {
    render(await DashboardLayout({ children: <p>content</p> }))
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the sidebar', async () => {
    render(await DashboardLayout({ children: <p>content</p> }))
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('passes the user to the sidebar', async () => {
    render(await DashboardLayout({ children: <p>content</p> }))
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-email', 'librarian@example.com')
  })
})
