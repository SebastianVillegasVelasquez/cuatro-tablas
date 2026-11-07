import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { QuoteResult } from '../api/client'
import type { TableConfiguration } from '../domain/types'
import { DEFAULT_CONFIGURATION } from '../domain/defaults'
import { scheduleQuote, withPreviousTotal } from './scheduleQuote'

const CONFIG: TableConfiguration = DEFAULT_CONFIGURATION

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('scheduleQuote', () => {
  it('reports loading immediately but only calls the server after the delay', async () => {
    const calculate = vi.fn().mockResolvedValue({ ok: true, totalCop: 1 })
    const onState = vi.fn()

    scheduleQuote(CONFIG, onState, { delayMs: 250, calculate })

    expect(onState).toHaveBeenCalledWith({ status: 'loading' })
    await vi.advanceTimersByTimeAsync(249)
    expect(calculate).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(calculate).toHaveBeenCalledTimes(1)
  })

  it('debounces a burst of changes into a single request for the last one', async () => {
    const calculate = vi.fn().mockResolvedValue({ ok: true, totalCop: 1 })
    const first = { ...CONFIG, width_cm: 100 }
    const last = { ...CONFIG, width_cm: 140 }

    const cancelFirst = scheduleQuote(first, vi.fn(), { delayMs: 250, calculate })
    await vi.advanceTimersByTimeAsync(100)
    cancelFirst()
    scheduleQuote(last, vi.fn(), { delayMs: 250, calculate })
    await vi.advanceTimersByTimeAsync(300)

    expect(calculate).toHaveBeenCalledTimes(1)
    expect(calculate.mock.calls[0][0]).toEqual(last)
  })

  it('discards a response that arrives after being cancelled', async () => {
    const pending = deferred<QuoteResult>()
    const calculate = vi.fn().mockReturnValue(pending.promise)
    const onState = vi.fn()

    const cancel = scheduleQuote(CONFIG, onState, { delayMs: 250, calculate })
    await vi.advanceTimersByTimeAsync(250) // request is now in flight
    cancel()
    pending.resolve({ ok: true, totalCop: 999 })
    await vi.advanceTimersByTimeAsync(0)

    expect(onState).not.toHaveBeenCalledWith({ status: 'ready', totalCop: 999 })
    expect(calculate.mock.calls[0][1].aborted).toBe(true)
  })

  it('reports the total when the server accepts the configuration', async () => {
    const calculate = vi.fn().mockResolvedValue({ ok: true, totalCop: 435000 })
    const onState = vi.fn()

    scheduleQuote(CONFIG, onState, { delayMs: 10, calculate })
    await vi.advanceTimersByTimeAsync(10)

    expect(onState).toHaveBeenLastCalledWith({ status: 'ready', totalCop: 435000 })
  })

  it('reports validation issues without treating them as errors', async () => {
    const issues = [{ field: 'width_cm', code: 'c', message: 'm' }]
    const calculate = vi.fn().mockResolvedValue({ ok: false, issues })
    const onState = vi.fn()

    scheduleQuote(CONFIG, onState, { delayMs: 10, calculate })
    await vi.advanceTimersByTimeAsync(10)

    expect(onState).toHaveBeenLastCalledWith({ status: 'invalid', issues })
  })

  it('reports an error when the request fails', async () => {
    const calculate = vi.fn().mockRejectedValue(new Error('network'))
    const onState = vi.fn()

    scheduleQuote(CONFIG, onState, { delayMs: 10, calculate })
    await vi.advanceTimersByTimeAsync(10)

    expect(onState).toHaveBeenLastCalledWith({ status: 'error' })
  })
})

describe('withPreviousTotal', () => {
  it('keeps the last known total while loading', () => {
    expect(
      withPreviousTotal({ status: 'ready', totalCop: 5 }, { status: 'loading' }),
    ).toEqual({ status: 'loading', previousTotalCop: 5 })
  })

  it('keeps the remembered total across consecutive loadings', () => {
    const loading = { status: 'loading', previousTotalCop: 5 } as const

    expect(withPreviousTotal(loading, { status: 'loading' })).toEqual(loading)
  })

  it('passes non-loading states through', () => {
    expect(withPreviousTotal({ status: 'loading' }, { status: 'error' })).toEqual({
      status: 'error',
    })
  })
})
