import { describe, expect, it } from 'vitest'
import { explodeLayout } from './explode'
import { tableLayout } from './layout'
import { DEFAULT_CONFIGURATION } from '../domain/defaults'

const assembled = tableLayout(DEFAULT_CONFIGURATION)

describe('explodeLayout', () => {
  it('leaves the table untouched at amount 0', () => {
    expect(explodeLayout(assembled, 0)).toEqual(assembled)
  })

  it('lifts the top and spreads the legs outward at amount 1', () => {
    const exploded = explodeLayout(assembled, 1)
    expect(exploded.top.position[1]).toBeGreaterThan(assembled.top.position[1])
    exploded.legs.forEach((leg, i) => {
      const before = assembled.legs[i]
      expect(Math.abs(leg.position[0])).toBeGreaterThan(Math.abs(before.position[0]))
      expect(Math.abs(leg.position[2])).toBeGreaterThan(Math.abs(before.position[2]))
      expect(leg.position[1]).toBeLessThan(before.position[1])
    })
  })

  it('never changes the size of a piece', () => {
    const exploded = explodeLayout(assembled, 0.6)
    expect(exploded.top.size).toEqual(assembled.top.size)
    exploded.legs.forEach((leg, i) => expect(leg.size).toEqual(assembled.legs[i].size))
  })

  it('clamps out-of-range amounts', () => {
    expect(explodeLayout(assembled, -3)).toEqual(explodeLayout(assembled, 0))
    expect(explodeLayout(assembled, 9)).toEqual(explodeLayout(assembled, 1))
  })
})
