import { useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import { DEFAULT_CONFIGURATION } from '../domain/defaults'
import { woodAppearance } from './appearance'
import { explodeLayout } from './explode'
import { tableLayout } from './layout'
import { createWoodTexture } from './woodTexture'

interface Props {
  /** Catalog id of the wood shown; the visitor can swap it from the hero. */
  materialId: string
  /** 0..1, how far the page has scrolled; drives how far the table is pulled apart. */
  scroll: RefObject<number>
  reducedMotion: boolean
}

const HERO_FINISH = 'lacado'
const BASE_LAYOUT = tableLayout(DEFAULT_CONFIGURATION)

function ExplodingTable({ scroll, reducedMotion, materialId }: Props) {
  const group = useRef<Group>(null)
  const amount = useRef(reducedMotion ? 0 : 1) // starts apart and assembles on load
  const texture = useMemo(() => createWoodTexture(), [])
  const { color, roughness } = woodAppearance(materialId, HERO_FINISH)
  const meshes = useRef<(Group | null)[]>([])

  useFrame((state, delta) => {
    const target = reducedMotion ? 0 : scroll.current
    amount.current = MathUtils.damp(amount.current, target, 2.6, delta)
    const exploded = explodeLayout(BASE_LAYOUT, amount.current)
    ;[exploded.top, ...exploded.legs].forEach((box, i) => {
      meshes.current[i]?.position.set(...box.position)
    })
    if (group.current && !reducedMotion) {
      // Slow spin plus a small lean toward the cursor.
      group.current.rotation.y += delta * 0.22
      group.current.rotation.x = MathUtils.damp(
        group.current.rotation.x,
        state.pointer.y * 0.12,
        3,
        delta,
      )
    }
  })

  const boxes = [BASE_LAYOUT.top, ...BASE_LAYOUT.legs]
  return (
    <group ref={group} rotation={[0, 0.7, 0]} position={[0, -0.35, 0]}>
      {boxes.map((box, i) => (
        <group
          key={i}
          ref={(node) => {
            meshes.current[i] = node
          }}
          position={box.position}
        >
          <mesh castShadow>
            <boxGeometry args={box.size} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              map={texture ?? undefined}
              metalness={0.05}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function HeroScene(props: Props) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [2.6, 1.5, 3.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={2.1} color="#ffd7a0" />
      <pointLight position={[-3, 1.5, -2]} intensity={12} color="#e3a04b" />
      <ExplodingTable {...props} />
      <ContactShadows position={[0, -0.36, 0]} opacity={0.5} scale={7} blur={2.8} far={2.2} />
    </Canvas>
  )
}
