import { describe, expect, it } from 'vitest'
import { contactLinks } from './contactLinks'

describe('contactLinks', () => {
  it('returns no links when nothing is configured', () => {
    expect(contactLinks({})).toEqual({ whatsapp: null, email: null })
  })

  it('builds a wa.me link from a number, keeping only digits', () => {
    const { whatsapp } = contactLinks({ VITE_CONTACT_WHATSAPP: '+57 300 123 4567' })
    expect(whatsapp).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/)
  })

  it('url-encodes the prefilled WhatsApp message', () => {
    const { whatsapp } = contactLinks({ VITE_CONTACT_WHATSAPP: '573001234567' })
    expect(whatsapp).not.toMatch(/\s/)
    expect(decodeURIComponent(whatsapp!.split('text=')[1])).toContain('4-tablas')
  })

  it('ignores a WhatsApp value that is not a plausible phone number', () => {
    expect(contactLinks({ VITE_CONTACT_WHATSAPP: 'abc' }).whatsapp).toBeNull()
    expect(contactLinks({ VITE_CONTACT_WHATSAPP: '123' }).whatsapp).toBeNull()
  })

  it('builds a mailto link with an encoded subject', () => {
    const { email } = contactLinks({ VITE_CONTACT_EMAIL: 'hola@example.com' })
    expect(email).toMatch(/^mailto:hola@example\.com\?subject=/)
    expect(email).not.toMatch(/\s/)
  })

  it('ignores a malformed email', () => {
    expect(contactLinks({ VITE_CONTACT_EMAIL: 'not-an-email' }).email).toBeNull()
  })
})
