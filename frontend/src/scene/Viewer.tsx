import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import type { TableConfiguration } from '../domain/types'
import { TableModel } from './TableModel'

interface Props {
  configuration: TableConfiguration
}

export function Viewer({ configuration }: Props) {
  return (
    <div className="viewer" role="img" aria-label="Vista 3D de la mesa configurada">
      <Canvas shadows camera={{ position: [2.2, 1.6, 2.2], fov: 40 }}>
        <color attach="background" args={['#efe7dc']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <TableModel configuration={configuration} />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={6} blur={2.4} far={2} />
        <OrbitControls
          enablePan={false}
          minDistance={1.2}
          maxDistance={5}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.4, 0]}
        />
      </Canvas>
    </div>
  )
}
