import { useMemo } from 'react'
import type { TableConfiguration } from '../domain/types'
import { woodAppearance } from './appearance'
import { tableLayout } from './layout'

interface Props {
  configuration: TableConfiguration
}

export function TableModel({ configuration }: Props) {
  const layout = useMemo(() => tableLayout(configuration), [configuration])
  const { color, roughness } = woodAppearance(configuration.material_id, configuration.finish_id)
  const boxes = [layout.top, ...layout.legs]

  return (
    <group>
      {boxes.map((box, index) => (
        <mesh key={index} position={box.position} castShadow receiveShadow>
          <boxGeometry args={box.size} />
          <meshStandardMaterial color={color} roughness={roughness} />
        </mesh>
      ))}
    </group>
  )
}
