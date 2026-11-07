import { describe, expect, it } from 'vitest'
import { woodAppearance } from './appearance'

describe('woodAppearance', () => {
  it('gives each known material its own colour', () => {
    const colors = ['pino', 'cedro', 'roble'].map((m) => woodAppearance(m, 'natural').color)

    expect(new Set(colors).size).toBe(3)
  })

  it('makes glossier finishes smoother', () => {
    expect(woodAppearance('pino', 'poliuretano').roughness).toBeLessThan(
      woodAppearance('pino', 'natural').roughness,
    )
  })

  it('falls back to a neutral look for unknown ids', () => {
    const unknown = woodAppearance('ebano', 'cera')

    expect(unknown.color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(unknown.roughness).toBeGreaterThan(0)
  })
})
