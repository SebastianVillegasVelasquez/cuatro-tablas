/// <reference types="vite/client" />

// Every VITE_* variable the app reads, typed in one place. All are optional:
// the app must still build and run when none is set.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_CONTACT_WHATSAPP?: string
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
