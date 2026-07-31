import { prisma } from '@/lib/prisma'
import CheckoutClient from './checkout-client'

export default async function CheckoutPage() {
  const expressZone = await prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } })

  return <CheckoutClient expressLocalities={expressZone?.localities ?? []} />
}
