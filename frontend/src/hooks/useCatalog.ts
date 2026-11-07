import { useEffect, useState } from 'react'
import { getCatalog } from '../api/client'
import type { Catalog } from '../domain/types'

export type CatalogState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; catalog: Catalog }

export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    getCatalog(controller.signal)
      .then((catalog) => setState({ status: 'ready', catalog }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error' })
      })
    return () => controller.abort()
  }, [])

  return state
}
