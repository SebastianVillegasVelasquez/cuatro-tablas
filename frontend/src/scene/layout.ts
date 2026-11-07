import type { TableConfiguration } from '../domain/types'

/** An axis-aligned box in scene units (metres), centred on `position`. Y is up. */
export interface Box {
  size: [number, number, number]
  position: [number, number, number]
}

export interface TableLayout {
  top: Box
  legs: Box[]
}

const CM_TO_M = 0.01
const LEG_INSET_CM = 5

/**
 * Pure mapping from a configuration (cm) to the boxes the 3D view draws (m).
 * It has no knowledge of three.js, so it can be tested without a GPU.
 */
export function tableLayout(config: TableConfiguration): TableLayout {
  const width = config.width_cm * CM_TO_M
  const depth = config.depth_cm * CM_TO_M
  const height = config.height_cm * CM_TO_M
  const thickness = config.top_thickness_cm * CM_TO_M
  const leg = config.leg_section_cm * CM_TO_M
  const legHeight = height - thickness
  const inset = LEG_INSET_CM * CM_TO_M

  const offsetX = Math.max(0, width / 2 - leg / 2 - inset)
  const offsetZ = Math.max(0, depth / 2 - leg / 2 - inset)

  const corners: [number, number][] = [
    [-offsetX, -offsetZ],
    [offsetX, -offsetZ],
    [-offsetX, offsetZ],
    [offsetX, offsetZ],
  ]

  return {
    top: { size: [width, thickness, depth], position: [0, height - thickness / 2, 0] },
    legs: corners.map(([x, z]) => ({
      size: [leg, legHeight, leg],
      position: [x, legHeight / 2, z],
    })),
  }
}
