import { describe, expect, it } from 'vitest'
import { formatCop } from './format'

describe('formatCop', () => {
  it('uses Colombian thousands separators and no decimals', () => {
    expect(formatCop(435000)).toMatch(/435\.000/)
    expect(formatCop(435000)).not.toMatch(/,/)
  })

  it('marks the amount as pesos', () => {
    expect(formatCop(1000)).toContain('$')
  })
})
