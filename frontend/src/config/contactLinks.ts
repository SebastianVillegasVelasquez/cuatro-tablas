export interface ContactEnv {
  VITE_CONTACT_WHATSAPP?: string
  VITE_CONTACT_EMAIL?: string
}

export interface ContactLinks {
  whatsapp: string | null
  email: string | null
}

const MESSAGE =
  'Hola, vi la demo de 4-tablas y quiero saber cómo se vería un configurador para mi taller.'
const SUBJECT = 'Configurador 3D para mi taller'

const MIN_PHONE_DIGITS = 8
const MAX_PHONE_DIGITS = 15 // E.164 upper bound
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Contact details come from the environment, not from source: they are the
 * owner's personal data, and a build without them must simply hide the buttons
 * instead of linking to nowhere.
 */
export function contactLinks(env: ContactEnv): ContactLinks {
  const digits = (env.VITE_CONTACT_WHATSAPP ?? '').replace(/\D/g, '')
  const email = (env.VITE_CONTACT_EMAIL ?? '').trim()

  const phoneOk = digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS
  return {
    whatsapp: phoneOk ? `https://wa.me/${digits}?text=${encodeURIComponent(MESSAGE)}` : null,
    email: EMAIL.test(email) ? `mailto:${email}?subject=${encodeURIComponent(SUBJECT)}` : null,
  }
}
