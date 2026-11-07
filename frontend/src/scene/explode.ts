import type { Box, TableLayout } from './layout'

const LIFT_TOP_M = 0.55
const SPREAD_LEGS_M = 0.4
const DROP_LEGS_M = 0.2

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function shift(box: Box, dx: number, dy: number, dz: number): Box {
  const [x, y, z] = box.position
  return { size: box.size, position: [x + dx, y + dy, z + dz] }
}

/**
 * Pulls an assembled table apart for the hero animation.
 * `amount` 0 is the table as built, 1 is fully exploded: the top rises and each
 * leg slides outward from the centre and sinks. Sizes never change, so the
 * pieces are always the ones the customer would receive.
 */
export function explodeLayout(layout: TableLayout, amount: number): TableLayout {
  const t = clamp01(amount)
  return {
    top: shift(layout.top, 0, LIFT_TOP_M * t, 0),
    legs: layout.legs.map((leg) =>
      shift(
        leg,
        Math.sign(leg.position[0]) * SPREAD_LEGS_M * t,
        -DROP_LEGS_M * t,
        Math.sign(leg.position[2]) * SPREAD_LEGS_M * t,
      ),
    ),
  }
}
