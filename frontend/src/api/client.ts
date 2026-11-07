import type { Catalog, Contact, TableConfiguration, ValidationIssue } from '../domain/types'

const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type QuoteResult =
  | { ok: true; totalCop: number }
  | { ok: false; issues: ValidationIssue[] }

export type SubmitResult =
  | { ok: true; id: string; totalCop: number }
  | { ok: false; reason: 'invalid_configuration'; issues: ValidationIssue[] }
  | { ok: false; reason: 'invalid_contact' | 'invalid_input' }

function postJson(path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
}

async function readError(response: Response): Promise<{ error?: string; issues?: ValidationIssue[] }> {
  try {
    return (await response.json()) as { error?: string; issues?: ValidationIssue[] }
  } catch {
    return {}
  }
}

export async function getCatalog(signal?: AbortSignal): Promise<Catalog> {
  const response = await fetch(`${BASE_URL}/catalog`, { signal })
  if (!response.ok) throw new ApiError('Could not load the catalog.', response.status)
  return (await response.json()) as Catalog
}

export async function calculateQuote(
  configuration: TableConfiguration,
  signal?: AbortSignal,
): Promise<QuoteResult> {
  const response = await postJson('/quote', configuration, signal)
  if (response.ok) {
    const body = (await response.json()) as { total_cop: number }
    return { ok: true, totalCop: body.total_cop }
  }
  if (response.status === 422) {
    const body = await readError(response)
    if (body.error === 'invalid_configuration' && body.issues) {
      return { ok: false, issues: body.issues }
    }
  }
  throw new ApiError('Could not calculate the quote.', response.status)
}

export async function submitQuoteRequest(
  configuration: TableConfiguration,
  contact: Contact,
  signal?: AbortSignal,
): Promise<SubmitResult> {
  const response = await postJson('/quote-requests', { configuration, contact }, signal)
  if (response.ok) {
    const body = (await response.json()) as { id: string; total_cop: number }
    return { ok: true, id: body.id, totalCop: body.total_cop }
  }
  if (response.status === 422) {
    const body = await readError(response)
    if (body.error === 'invalid_configuration' && body.issues) {
      return { ok: false, reason: 'invalid_configuration', issues: body.issues }
    }
    if (body.error === 'invalid_contact') return { ok: false, reason: 'invalid_contact' }
    return { ok: false, reason: 'invalid_input' }
  }
  throw new ApiError('Could not send the quote request.', response.status)
}
