import { render, screen } from '@testing-library/react'
import { NavItems } from '@/app/member/nav-items'

jest.mock('next/navigation', () => ({ usePathname: jest.fn().mockReturnValue('/member') }))

jest.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('NavItems', () => {
  it('renders the Dashboard link', () => {
    render(<NavItems />)
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders the Books link', () => {
    render(<NavItems />)
    expect(screen.getByRole('link', { name: /books/i })).toBeInTheDocument()
  })
})
