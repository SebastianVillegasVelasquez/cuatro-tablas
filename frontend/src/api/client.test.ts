import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, calculateQuote, getCatalog, submitQuoteRequest } from './client'
import type { TableConfiguration } from '../domain/types'

const CONFIG: TableConfiguration = {
  width_cm: 120,
  depth_cm: 60,
  height_cm: 75,
  material_id: 'pino',
  finish_id: 'natural',
  top_thickness_cm: 3,
  leg_section_cm: 6,
}

const fetchMock = vi.fn()

function reply(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status })
}

beforeEach(() => vi.stubGlobal('fetch', fetchMock))
afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('getCatalog', () => {
  it('returns the catalog', async () => {
    const catalog = { materials: [], finishes: [], limits: {} }
    fetchMock.mockResolvedValue(reply(catalog))

    expect(await getCatalog()).toEqual(catalog)
  })

  it('throws an ApiError when the server fails', async () => {
    fetchMock.mockResolvedValue(reply({}, 500))

    await expect(getCatalog()).rejects.toMatchObject({ name: 'ApiError', status: 500 })
  })
})

describe('calculateQuote', () => {
  it('posts the configuration and returns the total', async () => {
    fetchMock.mockResolvedValue(reply({ total_cop: 435000, currency: 'COP' }))

    const result = await calculateQuote(CONFIG)

    expect(result).toEqual({ ok: true, totalCop: 435000 })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toMatch(/\/quote$/)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual(CONFIG)
  })

  it('returns the issues of an invalid configuration instead of throwing', async () => {
    const issues = [{ field: 'width_cm', code: 'width_cm_out_of_range', message: 'x' }]
    fetchMock.mockResolvedValue(reply({ error: 'invalid_configuration', issues }, 422))

    expect(await calculateQuote(CONFIG)).toEqual({ ok: false, issues })
  })

  it('throws on unexpected server errors', async () => {
    fetchMock.mockResolvedValue(reply({}, 500))

    await expect(calculateQuote(CONFIG)).rejects.toBeInstanceOf(ApiError)
  })

  it('forwards the abort signal so stale requests can be cancelled', async () => {
    fetchMock.mockResolvedValue(reply({ total_cop: 1 }))
    const controller = new AbortController()

    await calculateQuote(CONFIG, controller.signal)

    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal)
  })
})

describe('submitQuoteRequest', () => {
  const contact = { name: 'Ana', email: 'ana@example.com' }

  it('returns the id and total of the stored request', async () => {
    fetchMock.mockResolvedValue(reply({ id: 'req-1', total_cop: 435000 }, 201))

    expect(await submitQuoteRequest(CONFIG, contact)).toEqual({
      ok: true,
      id: 'req-1',
      totalCop: 435000,
    })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ configuration: CONFIG, contact })
  })

  it('distinguishes an invalid contact', async () => {
    fetchMock.mockResolvedValue(reply({ error: 'invalid_contact', message: 'x' }, 422))

    expect(await submitQuoteRequest(CONFIG, { name: 'Ana' })).toEqual({
      ok: false,
      reason: 'invalid_contact',
    })
  })

  it('maps schema validation errors to invalid_input', async () => {
    fetchMock.mockResolvedValue(reply({ detail: [{ msg: 'bad email' }] }, 422))

    expect(await submitQuoteRequest(CONFIG, contact)).toEqual({
      ok: false,
      reason: 'invalid_input',
    })
  })

  it('throws on unexpected server errors', async () => {
    fetchMock.mockResolvedValue(reply({}, 503))

    await expect(submitQuoteRequest(CONFIG, contact)).rejects.toMatchObject({ status: 503 })
  })
})
