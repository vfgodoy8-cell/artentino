import CheckoutClient from './checkout-client'
import { getSiteContact } from '@/app/lib/site-contact'

export default async function CheckoutPage() {
  const contact = await getSiteContact()
  return <CheckoutClient pickupAddress={contact.addressLine1} />
}
