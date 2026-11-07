import type { Contact } from './types'

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
}

export const EMPTY_CONTACT_FORM: ContactForm = { name: '', email: '', phone: '', message: '' }

const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Quick feedback before sending. The server remains the authority on validity. */
export function validateContactForm(form: ContactForm): string | null {
  if (!form.name.trim()) return 'Ingresa tu nombre.'
  const email = form.email.trim()
  if (!email && !form.phone.trim()) return 'Déjanos un correo o un teléfono para contactarte.'
  if (email && !LOOKS_LIKE_EMAIL.test(email)) return 'El correo no parece válido.'
  return null
}

/** Trim everything and leave out empty optional fields instead of sending "". */
export function toContact(form: ContactForm): Contact {
  const contact: Contact = { name: form.name.trim() }
  if (form.email.trim()) contact.email = form.email.trim()
  if (form.phone.trim()) contact.phone = form.phone.trim()
  if (form.message.trim()) contact.message = form.message.trim()
  return contact
}
