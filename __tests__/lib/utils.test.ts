import { formatLocalDateTime } from '@/lib/utils'

describe('formatLocalDateTime', () => {
  it('returns a string containing the year for the given ISO string', () => {
    const result = formatLocalDateTime('2026-03-21T14:30:00Z')
    expect(result).toMatch(/2026/)
  })

  it('returns different output for different ISO strings', () => {
    const first = formatLocalDateTime('2026-01-01T00:00:00Z')
    const second = formatLocalDateTime('2026-06-15T12:00:00Z')
    expect(first).not.toBe(second)
  })
})
