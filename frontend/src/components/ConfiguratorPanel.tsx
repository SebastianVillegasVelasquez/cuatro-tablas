import { DIMENSION_KEYS } from '../domain/types'
import type { Catalog, DimensionKey, TableConfiguration } from '../domain/types'

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  width_cm: 'Ancho',
  depth_cm: 'Fondo',
  height_cm: 'Alto',
  top_thickness_cm: 'Espesor de la tapa',
  leg_section_cm: 'Sección de las patas',
}

interface Props {
  catalog: Catalog
  configuration: TableConfiguration
  onChange: (next: TableConfiguration) => void
}

export function ConfiguratorPanel({ catalog, configuration, onChange }: Props) {
  return (
    <form className="panel" aria-label="Configuración de la mesa" onSubmit={(e) => e.preventDefault()}>
      <h2>Tu mesa</h2>

      {DIMENSION_KEYS.map((key) => {
        const { min, max } = catalog.limits[key]
        const id = `field-${key}`
        return (
          <div className="field" key={key}>
            <label htmlFor={id}>
              {DIMENSION_LABELS[key]} <output htmlFor={id}>{configuration[key]} cm</output>
            </label>
            <input
              id={id}
              type="range"
              min={min}
              max={max}
              step={1}
              value={configuration[key]}
              onChange={(e) => onChange({ ...configuration, [key]: Number(e.target.value) })}
            />
          </div>
        )
      })}

      <div className="field">
        <label htmlFor="field-material">Material</label>
        <select
          id="field-material"
          value={configuration.material_id}
          onChange={(e) => onChange({ ...configuration, material_id: e.target.value })}
        >
          {catalog.materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="field-finish">Acabado</label>
        <select
          id="field-finish"
          value={configuration.finish_id}
          onChange={(e) => onChange({ ...configuration, finish_id: e.target.value })}
        >
          {catalog.finishes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}
