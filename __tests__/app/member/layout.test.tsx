import { render, screen } from '@testing-library/react'
import MemberLayout from '@/app/member/layout'

jest.mock('@/app/actions/auth', () => ({ signOut: jest.fn() }))
jest.mock('@/app/member/nav-items', () => ({
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

describe('MemberLayout', () => {
  it('renders children', () => {
    render(<MemberLayout><p>content</p></MemberLayout>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the sidebar', () => {
    render(<MemberLayout><p>content</p></MemberLayout>)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
