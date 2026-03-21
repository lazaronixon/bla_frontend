import { render, screen } from '@testing-library/react'
import DashboardLayout from '@/app/librarian/layout'

jest.mock('@/app/actions/auth', () => ({ signOut: jest.fn() }))
jest.mock('@/app/librarian/nav-items', () => ({
  NavItems: () => <nav data-testid="nav-items" />,
}))

jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar">{children}</div>,
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarHeader: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarFooter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SidebarSeparator: () => null,
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
