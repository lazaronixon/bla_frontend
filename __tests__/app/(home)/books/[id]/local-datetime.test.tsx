import { render, screen } from '@testing-library/react'
import { LocalDateTime } from '@/app/(home)/books/[id]/local-datetime'

describe('LocalDateTime', () => {
  it('renders a formatted date and time for the given ISO string', () => {
    render(<LocalDateTime iso="2026-03-21T14:30:00Z" />)
    // The exact output depends on the test environment's locale/timezone,
    // so just verify something meaningful is rendered.
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('renders different output for different ISO strings', () => {
    const { rerender } = render(<LocalDateTime iso="2026-01-01T00:00:00Z" />)
    const first = document.body.textContent

    rerender(<LocalDateTime iso="2026-06-15T12:00:00Z" />)
    const second = document.body.textContent

    expect(first).not.toBe(second)
  })
})
