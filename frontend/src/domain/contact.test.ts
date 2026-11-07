import { describe, expect, it } from 'vitest'
import { EMPTY_CONTACT_FORM, toContact, validateContactForm } from './contact'

const FORM = { ...EMPTY_CONTACT_FORM, name: 'Ana', email: 'ana@example.com' }

describe('validateContactForm', () => {
  it('accepts a name with an email', () => {
    expect(validateContactForm(FORM)).toBeNull()
  })

  it('accepts a name with only a phone', () => {
    expect(validateContactForm({ ...EMPTY_CONTACT_FORM, name: 'Ana', phone: '3001234567' })).toBeNull()
  })

  it('requires a name', () => {
    expect(validateContactForm({ ...FORM, name: '  ' })).toMatch(/nombre/i)
  })

  it('requires a way to be reached', () => {
    expect(validateContactForm({ ...EMPTY_CONTACT_FORM, name: 'Ana' })).toMatch(/correo|teléfono/i)
  })

  it('rejects an email that does not look like one', () => {
    expect(validateContactForm({ ...FORM, email: 'ana@' })).toMatch(/correo/i)
  })
})

describe('toContact', () => {
  it('omits empty optional fields', () => {
    expect(toContact(FORM)).toEqual({ name: 'Ana', email: 'ana@example.com' })
  })

  it('trims values', () => {
    expect(toContact({ name: ' Ana ', email: ' a@b.co ', phone: ' 300 ', message: ' hola ' })).toEqual({
      name: 'Ana',
      email: 'a@b.co',
      phone: '300',
      message: 'hola',
    })
  })
})
