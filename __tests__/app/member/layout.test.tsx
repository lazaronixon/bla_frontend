import { render, screen } from '@testing-library/react'
import MemberLayout from '@/app/member/layout'

jest.mock('@/app/actions/auth', () => ({ signOut: jest.fn() }))
jest.mock('@/app/member/app-sidebar', () => ({
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
