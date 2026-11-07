import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

const SIZE = 512

// Small deterministic PRNG so the grain looks the same on every load.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Procedural, neutral-toned wood grain drawn on a canvas. It is multiplied by the
 * material colour, so one texture serves every species and no image has to be
 * downloaded. Returns null where there is no DOM (tests, SSR).
 */
export function createWoodTexture(seed = 4): CanvasTexture | null {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const random = mulberry32(seed)
  ctx.fillStyle = '#f1e8dc'
  ctx.fillRect(0, 0, SIZE, SIZE)

  for (let i = 0; i < 260; i++) {
    const x = random() * SIZE
    const wobble = 2 + random() * 6
    const phase = random() * Math.PI * 2
    ctx.strokeStyle = `rgba(70, 42, 20, ${0.05 + random() * 0.16})`
    ctx.lineWidth = 0.5 + random() * 1.6
    ctx.beginPath()
    for (let y = 0; y <= SIZE; y += 8) {
      const dx = Math.sin(y / 46 + phase) * wobble
      if (y === 0) ctx.moveTo(x + dx, y)
      else ctx.lineTo(x + dx, y)
    }
    ctx.stroke()
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.anisotropy = 4
  return texture
}
