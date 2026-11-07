// Field names mirror the API (snake_case) on purpose: the wire format and the
// domain share one vocabulary, so there is no mapping layer to get wrong.

export interface TableConfiguration {
  width_cm: number
  depth_cm: number
  height_cm: number
  material_id: string
  finish_id: string
  top_thickness_cm: number
  leg_section_cm: number
}

export const DIMENSION_KEYS = [
  'width_cm',
  'depth_cm',
  'height_cm',
  'top_thickness_cm',
  'leg_section_cm',
] as const

export type DimensionKey = (typeof DIMENSION_KEYS)[number]

export interface Option {
  id: string
  name: string
}

export interface Range {
  min: number
  max: number
}

export interface Catalog {
  materials: Option[]
  finishes: Option[]
  limits: Record<DimensionKey, Range>
}

export interface ValidationIssue {
  field: string
  code: string
  message: string
}

export interface Contact {
  name: string
  email?: string
  phone?: string
  message?: string
}
