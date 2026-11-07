import { describe, expect, it } from 'vitest'
import type { TableConfiguration } from '../domain/types'
import { tableLayout } from './layout'

const CONFIG: TableConfiguration = {
  width_cm: 120,
  depth_cm: 60,
  height_cm: 75,
  material_id: 'pino',
  finish_id: 'natural',
  top_thickness_cm: 3,
  leg_section_cm: 6,
}

describe('tableLayout', () => {
  it('converts centimetres to metres', () => {
    const { top } = tableLayout(CONFIG)

    expect(top.size[0]).toBeCloseTo(1.2)
    expect(top.size[1]).toBeCloseTo(0.03)
    expect(top.size[2]).toBeCloseTo(0.6)
  })

  it('has exactly four legs', () => {
    expect(tableLayout(CONFIG).legs).toHaveLength(4)
  })

  it('stands the top on the legs: legs end where the top begins', () => {
    const { top, legs } = tableLayout(CONFIG)
    const topBottom = top.position[1] - top.size[1] / 2

    for (const leg of legs) {
      expect(leg.position[1] + leg.size[1] / 2).toBeCloseTo(topBottom)
    }
  })

  it('reaches the configured total height', () => {
    const { top } = tableLayout(CONFIG)

    expect(top.position[1] + top.size[1] / 2).toBeCloseTo(0.75)
  })

  it('places the legs on the floor', () => {
    for (const leg of tableLayout(CONFIG).legs) {
      expect(leg.position[1] - leg.size[1] / 2).toBeCloseTo(0)
    }
  })

  it('keeps every leg inside the footprint of the top, even at the smallest size', () => {
    const smallest = { ...CONFIG, width_cm: 60, depth_cm: 40, leg_section_cm: 10 }
    const { top, legs } = tableLayout(smallest)

    for (const leg of legs) {
      expect(Math.abs(leg.position[0]) + leg.size[0] / 2).toBeLessThanOrEqual(top.size[0] / 2)
      expect(Math.abs(leg.position[2]) + leg.size[2] / 2).toBeLessThanOrEqual(top.size[2] / 2)
    }
  })

  it('places legs symmetrically', () => {
    const xs = tableLayout(CONFIG).legs.map((l) => l.position[0])

    expect(Math.min(...xs)).toBeCloseTo(-Math.max(...xs))
  })
})
