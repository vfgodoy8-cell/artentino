import CheckoutClient from './checkout-client'
import { getSiteContact } from '@/app/lib/site-contact'

type Props = { searchParams: Promise<{ modo?: string; orderId?: string }> }

export default async function CheckoutPage({ searchParams }: Props) {
  const { modo, orderId } = await searchParams
  const contact = await getSiteContact()
  // MODO devuelve al comprador acá (callback) cuando el pago se rechaza, falla o se abandona.
  const modoRetryOrderId = modo === 'retry' && orderId ? orderId : null
  return <CheckoutClient pickupAddress={contact.addressLine1} modoRetryOrderId={modoRetryOrderId} />
}
