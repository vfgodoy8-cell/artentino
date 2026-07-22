import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CheckoutClient from './checkout-client'

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/checkout')

  const expressZone = await prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } })

  return <CheckoutClient expressLocalities={expressZone?.localities ?? []} />
}
