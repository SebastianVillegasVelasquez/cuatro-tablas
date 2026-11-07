import { useState } from 'react'
import type { FormEvent } from 'react'
import { submitQuoteRequest } from '../api/client'
import { EMPTY_CONTACT_FORM, toContact, validateContactForm } from '../domain/contact'
import type { ContactForm } from '../domain/contact'
import { formatCop } from '../domain/format'
import type { TableConfiguration } from '../domain/types'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; totalCop: number }
  | { kind: 'error'; message: string }

interface Props {
  configuration: TableConfiguration
  /** False while the price is loading or the configuration is not valid. */
  canSubmit: boolean
}

const FAILURE_MESSAGES = {
  invalid_contact: 'Ingresa tu nombre y al menos un correo o un teléfono.',
  invalid_input: 'Revisa los datos ingresados e inténtalo de nuevo.',
  invalid_configuration: 'Esta configuración no es válida. Ajústala e inténtalo de nuevo.',
} as const

export function QuoteRequestForm({ configuration, canSubmit }: Props) {
  const [form, setForm] = useState<ContactForm>(EMPTY_CONTACT_FORM)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const update = (field: keyof ContactForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const problem = validateContactForm(form)
    if (problem) {
      setStatus({ kind: 'error', message: problem })
      return
    }

    setStatus({ kind: 'sending' })
    try {
      const result = await submitQuoteRequest(configuration, toContact(form))
      if (result.ok) {
        setStatus({ kind: 'sent', totalCop: result.totalCop })
        setForm(EMPTY_CONTACT_FORM)
      } else {
        setStatus({ kind: 'error', message: FAILURE_MESSAGES[result.reason] })
      }
    } catch {
      setStatus({
        kind: 'error',
        message: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.',
      })
    }
  }

  if (status.kind === 'sent') {
    return (
      <section className="request" role="status">
        <h2>¡Solicitud enviada!</h2>
        <p>
          Registramos una solicitud de <strong>{formatCop(status.totalCop)}</strong>. Es una demo:
          nadie te contactará, pero así recibiría un taller la solicitud de su cliente.
        </p>
        <button type="button" onClick={() => setStatus({ kind: 'idle' })}>
          Hacer otra solicitud
        </button>
      </section>
    )
  }

  const sending = status.kind === 'sending'

  return (
    <form className="request" onSubmit={handleSubmit} noValidate aria-label="Solicitar cotización">
      <h2>Solicitar cotización</h2>
      <p className="request__hint">Demo: usa datos de prueba, no reales.</p>

      <div className="field">
        <label htmlFor="contact-name">Nombre</label>
        <input
          id="contact-name"
          autoComplete="name"
          maxLength={120}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Correo</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-phone">Teléfono</label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-message">Mensaje (opcional)</label>
        <textarea
          id="contact-message"
          rows={3}
          maxLength={1000}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>

      {status.kind === 'error' && (
        <p className="request__error" role="alert">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={!canSubmit || sending}>
        {sending ? 'Enviando…' : 'Enviar solicitud'}
      </button>
      {!canSubmit && (
        <p className="request__hint">Disponible cuando el precio esté calculado.</p>
      )}
    </form>
  )
}
