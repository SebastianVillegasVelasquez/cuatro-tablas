export interface WoodAppearance {
  color: string
  roughness: number
}

// Visual hints keyed by catalog id. Unknown ids fall back to a neutral wood so a
// new material added in the backend still renders instead of breaking the scene.
const WOOD_COLORS: Partial<Record<string, string>> = {
  pino: '#d8b98a',
  cedro: '#b8693d',
  roble: '#8c5a34',
}

const FINISH_ROUGHNESS: Partial<Record<string, number>> = {
  natural: 0.85,
  lacado: 0.4,
  poliuretano: 0.2,
}

const FALLBACK: WoodAppearance = { color: '#c9a778', roughness: 0.7 }

export function woodAppearance(materialId: string, finishId: string): WoodAppearance {
  return {
    color: WOOD_COLORS[materialId] ?? FALLBACK.color,
    roughness: FINISH_ROUGHNESS[finishId] ?? FALLBACK.roughness,
  }
}
