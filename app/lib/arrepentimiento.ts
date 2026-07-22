import { ARREPENTIMIENTO_WINDOW_DAYS } from '@/app/lib/constants'

export function isWithinArrepentimientoWindow(deliveredAt: Date | null): boolean {
  if (!deliveredAt) return false
  const msElapsed = Date.now() - deliveredAt.getTime()
  return msElapsed <= ARREPENTIMIENTO_WINDOW_DAYS * 24 * 60 * 60 * 1000
}
