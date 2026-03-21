import { render, screen } from '@testing-library/react'
import DashboardLayout from '@/app/(home)/layout'

jest.mock('@/lib/session', () => ({ getSession: jest.fn().mockResolvedValue(null) }))
jest.mock('@/lib/config', () => ({ BACKEND_URL: 'http://localhost:3000' }))
jest.mock('@/app/actions/auth', () => ({ signOut: jest.fn() }))
jest.mock('@/app/(home)/nav-items', () => ({
  NavItems: ({ isLibrarian }: { isLibrarian: boolean }) => <nav data-testid="nav-items" data-librarian={isLibrarian} />,
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
  it('renders children', async () => {
    render(await DashboardLayout({ children: <p>content</p> }))
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the sidebar', async () => {
    render(await DashboardLayout({ children: <p>content</p> }))
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
