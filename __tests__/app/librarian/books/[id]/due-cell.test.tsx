import { render, screen } from '@testing-library/react'
import { DueCell } from '@/app/librarian/books/[id]/due-cell'

describe('DueCell', () => {
  it('renders the formatted due date', () => {
    render(<DueCell dueAt="2026-04-01T00:00:00Z" />)
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('shows the overdue icon when past due and not returned', () => {
    render(<DueCell dueAt="2020-01-01T00:00:00Z" />)
    expect(document.querySelector('.lucide-triangle-alert')).toBeTruthy()
  })

  it('shows the check icon when not yet due', () => {
    render(<DueCell dueAt="2099-01-01T00:00:00Z" />)
    expect(document.querySelector('.lucide-circle-check')).toBeTruthy()
  })

  it('does not show the overdue icon when not yet due', () => {
    render(<DueCell dueAt="2099-01-01T00:00:00Z" />)
    expect(document.querySelector('.lucide-triangle-alert')).toBeNull()
  })

  it('shows the check icon when returned even if overdue', () => {
    render(<DueCell dueAt="2020-01-01T00:00:00Z" returnedAt="2020-01-02T00:00:00Z" />)
    expect(document.querySelector('.lucide-circle-check')).toBeTruthy()
    expect(document.querySelector('.lucide-triangle-alert')).toBeNull()
  })
})
