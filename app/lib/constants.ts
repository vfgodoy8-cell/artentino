/** Destinatario de los avisos internos (pedidos, contacto, arrepentimiento, turnos). */
export const ADMIN_NOTIFICATION_EMAIL = 'info@artentino.com'

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

/**
 * MODO (app/lib/modo.ts).
 * - MODO_USER_AGENT: MODO exige el header User-Agent con el nombre del comercio en todos
 *   los requests — sin él los rechaza.
 * - MODO_CC_CODE: condición comercial (cuotas) que ve el comprador. 1CSI = 1 cuota sin interés.
 *   Listado: https://merchants.modo.com.ar/docs/f786d7df-655a-464a-be85-411a806b055a
 */
export const MODO_USER_AGENT = 'Artentino'
export const MODO_CC_CODE = '1CSI'

/** Nombre visible de cada valor de Order.paymentMethod (admin, resumen del checkout). */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  mercadopago: 'MercadoPago',
  cash: 'Efectivo',
  transfer: 'Transferencia bancaria',
  modo: 'MODO',
}

/**
 * Textos de MODO en el checkout. El título sigue los lineamientos de marca de MODO: el
 * selector debe decir "MODO y Apps Bancarias"
 * (https://merchants.modo.com.ar/docs/a6a11628-1019-46d1-b81f-592bea5d23ac).
 */
export const MODO_PAYMENT_TITLE = 'MODO y Apps Bancarias'
export const MODO_PAYMENT_SUBTITLE = 'Billetera digital'
export const MODO_PAY_CTA = 'Pagar con MODO'
export const MODO_RETRY_MESSAGE =
  'El pago con MODO no se completó. Tu pedido sigue guardado: podés reintentar el pago.'

/**
 * sessionStorage: datos del checkout guardados antes de redirigir al site de MODO, para
 * restaurar el formulario si el comprador vuelve sin pagar (callback de error/abandono).
 */
export const MODO_CHECKOUT_DRAFT_KEY = 'artentino-modo-checkout'
