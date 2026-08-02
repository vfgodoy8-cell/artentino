/**
 * Resuelve la URL base del sitio a partir de NEXT_PUBLIC_BASE_URL, con fallbacks
 * controlados para que ningún caller termine armando un link con "undefined".
 */
export function resolveBaseUrl(finalFallback: string = 'http://localhost:3000'): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL

  console.warn(
    '[base-url] NEXT_PUBLIC_BASE_URL no está seteada — revisar variables de entorno en Vercel.',
  )
  // Fallback controlado: en Vercel, VERCEL_PROJECT_PRODUCTION_URL siempre está presente
  // y apunta al dominio real de producción, evitando que se termine usando finalFallback.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return finalFallback
}
