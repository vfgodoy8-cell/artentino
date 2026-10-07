/**
 * Minúsculas + sin tildes/diacríticos — para comparar texto tipeado por el usuario
 * (sin cuidado con acentos, ej. "lampara") contra datos que sí los llevan ("Lámpara").
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .trim()
}
