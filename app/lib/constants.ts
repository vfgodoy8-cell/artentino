/** Descuento por pago en efectivo o transferencia (0.25 = 25%) */
export const CASH_DISCOUNT = 0.25
export const CASH_DISCOUNT_PCT = 25

/** Días corridos desde la entrega para poder ejercer el botón de arrepentimiento (Resolución 424/2020) */
export const ARREPENTIMIENTO_WINDOW_DAYS = 10

/**
 * Reconciliación de órdenes PENDING de MercadoPago (app/api/cron/reconcile-orders).
 * - RECONCILE_MIN_AGE_HOURS: no tocar órdenes más nuevas que esto — le da tiempo al
 *   webhook (y al cliente, que puede seguir pagando) antes de que el cron intervenga.
 * - RECONCILE_CANCEL_AGE_HOURS: recién a partir de esta antigüedad se cancela una orden
 *   sin ningún payment encontrado en MP — evita cancelar pagos que están simplemente
 *   demorados en confirmarse.
 */
export const RECONCILE_MIN_AGE_HOURS = 1
export const RECONCILE_CANCEL_AGE_HOURS = 72
