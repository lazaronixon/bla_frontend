import { render, screen } from '@testing-library/react'
import { AppSidebar } from '@/app/member/app-sidebar'

jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  SidebarMenuButton: ({ children }: { children: React.ReactNode; asChild?: boolean }) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  SidebarMenuSubButton: ({ children }: { children: React.ReactNode; asChild?: boolean }) => <div>{children}</div>,
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
}))

jest.mock('lucide-react', () => ({
  GalleryVerticalEndIcon: () => null,
}))

const user = { email_address: 'member@example.com' }

describe('AppSidebar (member)', () => {
  it('renders the Dashboard link', () => {
    render(<AppSidebar user={user} />)
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders the Books link', () => {
    render(<AppSidebar user={user} />)
    expect(screen.getByRole('link', { name: /books/i })).toBeInTheDocument()
  })

  it('renders the Sign Out link', () => {
    render(<AppSidebar user={user} />)
    expect(screen.getByRole('link', { name: /sign out/i })).toBeInTheDocument()
  })

  it('renders the Session group', () => {
    render(<AppSidebar user={user} />)
    expect(screen.getByText('Session')).toBeInTheDocument()
  })

  it('displays the user email address', () => {
    render(<AppSidebar user={user} />)
    expect(screen.getByText('member@example.com')).toBeInTheDocument()
  })
})
