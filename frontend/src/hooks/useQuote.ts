import { useEffect, useState } from 'react'
import type { TableConfiguration } from '../domain/types'
import { scheduleQuote, withPreviousTotal } from './scheduleQuote'
import type { QuoteState } from './scheduleQuote'

export function useQuote(configuration: TableConfiguration): QuoteState {
  const [state, setState] = useState<QuoteState>({ status: 'loading' })

  useEffect(
    () => scheduleQuote(configuration, (next) => setState((prev) => withPreviousTotal(prev, next))),
    [configuration],
  )

  return state
}
