import { render } from '@testing-library/react'
import Page from '@/app/(dashboard)/page'

describe('Page', () => {
  it('renders without errors', () => {
    expect(() => render(<Page />)).not.toThrow()
  })
})
