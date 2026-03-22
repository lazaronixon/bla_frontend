import { render, screen } from '@testing-library/react'
import DashboardLayout from '@/app/librarian/layout'

jest.mock('@/app/actions/auth', () => ({ signOut: jest.fn() }))
jest.mock('@/app/librarian/app-sidebar', () => ({
  AppSidebar: () => <div data-testid="sidebar" />,
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
  it('renders children', () => {
    render(<DashboardLayout><p>content</p></DashboardLayout>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the sidebar', () => {
    render(<DashboardLayout><p>content</p></DashboardLayout>)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
