import { getSiteContact } from '@/app/lib/site-contact'
import TurnosForm from './turnos-form'

export default async function TurnosPage() {
  const contact = await getSiteContact()
  return <TurnosForm address={contact.addressLine1} />
}
