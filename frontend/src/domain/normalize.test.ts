import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIGURATION } from './defaults'
import { normalizeConfiguration } from './normalize'
import type { Catalog } from './types'

const CATALOG: Catalog = {
  materials: [
    { id: 'cedro', name: 'Cedro' },
    { id: 'pino', name: 'Pino' },
  ],
  finishes: [{ id: 'lacado', name: 'Lacado' }],
  limits: {
    width_cm: { min: 60, max: 240 },
    depth_cm: { min: 40, max: 120 },
    height_cm: { min: 45, max: 110 },
    top_thickness_cm: { min: 2, max: 6 },
    leg_section_cm: { min: 4, max: 10 },
  },
}

describe('normalizeConfiguration', () => {
  it('keeps a valid configuration as it is', () => {
    const valid = { ...DEFAULT_CONFIGURATION, finish_id: 'lacado' }

    expect(normalizeConfiguration(valid, CATALOG)).toEqual(valid)
  })

  it('clamps dimensions into the catalog limits', () => {
    const result = normalizeConfiguration(
      { ...DEFAULT_CONFIGURATION, finish_id: 'lacado', width_cm: 500, depth_cm: 5 },
      CATALOG,
    )

    expect(result.width_cm).toBe(240)
    expect(result.depth_cm).toBe(40)
  })

  it('replaces unknown material and finish with the first option', () => {
    const result = normalizeConfiguration(
      { ...DEFAULT_CONFIGURATION, material_id: 'roble', finish_id: 'natural' },
      CATALOG,
    )

    expect(result.material_id).toBe('cedro')
    expect(result.finish_id).toBe('lacado')
  })

  it('does not mutate its input', () => {
    const input = { ...DEFAULT_CONFIGURATION, width_cm: 999 }

    normalizeConfiguration(input, CATALOG)

    expect(input.width_cm).toBe(999)
  })
})
