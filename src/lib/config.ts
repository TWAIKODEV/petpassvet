import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (import.meta.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = import.meta.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: import.meta.env.NODE_ENV === "development",
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
})