import { DIMENSION_KEYS } from './types'
import type { Catalog, TableConfiguration } from './types'

/**
 * Makes a configuration valid for the catalog the server actually offers:
 * dimensions are clamped into their limits and unknown material/finish ids are
 * replaced by the first option. The server stays the authority; this only keeps
 * the UI from starting in a state the server would reject.
 */
export function normalizeConfiguration(
  configuration: TableConfiguration,
  catalog: Catalog,
): TableConfiguration {
  const next = { ...configuration }

  for (const key of DIMENSION_KEYS) {
    const { min, max } = catalog.limits[key]
    next[key] = Math.min(max, Math.max(min, configuration[key]))
  }
  if (!catalog.materials.some((m) => m.id === next.material_id)) {
    next.material_id = catalog.materials[0]?.id ?? next.material_id
  }
  if (!catalog.finishes.some((f) => f.id === next.finish_id)) {
    next.finish_id = catalog.finishes[0]?.id ?? next.finish_id
  }
  return next
}
