import { calculateQuote } from '../api/client'
import type { TableConfiguration, ValidationIssue } from '../domain/types'

export type QuoteState =
  | { status: 'loading'; previousTotalCop?: number }
  | { status: 'ready'; totalCop: number }
  | { status: 'invalid'; issues: ValidationIssue[] }
  | { status: 'error' }

interface Options {
  delayMs?: number
  calculate?: typeof calculateQuote
}

/**
 * Asks the server for a price after a short pause and returns a cancel function.
 *
 * Dragging a slider fires dozens of changes. Two things keep that honest:
 * - debounce: only the last configuration of a burst is sent;
 * - cancellation: a response that arrives after a newer change is discarded, so
 *   a slow old answer can never overwrite a newer one (a classic race).
 *
 * It is plain TypeScript (no React) so both behaviours are tested with fake timers.
 */
export function scheduleQuote(
  configuration: TableConfiguration,
  onState: (state: QuoteState) => void,
  { delayMs = 250, calculate = calculateQuote }: Options = {},
): () => void {
  const controller = new AbortController()
  onState({ status: 'loading' })

  const timer = setTimeout(async () => {
    try {
      const result = await calculate(configuration, controller.signal)
      if (controller.signal.aborted) return
      onState(
        result.ok
          ? { status: 'ready', totalCop: result.totalCop }
          : { status: 'invalid', issues: result.issues },
      )
    } catch {
      if (!controller.signal.aborted) onState({ status: 'error' })
    }
  }, delayMs)

  return () => {
    clearTimeout(timer)
    controller.abort()
  }
}

/** While a new price loads, keep showing the last known total instead of a blank. */
export function withPreviousTotal(previous: QuoteState, next: QuoteState): QuoteState {
  if (next.status !== 'loading') return next
  if (previous.status === 'ready') return { status: 'loading', previousTotalCop: previous.totalCop }
  if (previous.status === 'loading') return previous
  return next
}
