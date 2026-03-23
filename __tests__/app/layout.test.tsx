import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}))

jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const originalError = console.error

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('cannot be a child of')) return
    originalError(...args)
  }
})

afterAll(() => {
  console.error = originalError
})

describe('RootLayout', () => {
  it('renders children', () => {
    render(<RootLayout><p>content</p></RootLayout>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders the toaster', () => {
    render(<RootLayout><p>content</p></RootLayout>)
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })
})
