'use server'

import { addContactToBrevo } from '@/app/lib/brevo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SubscribeResult = { success: true } | { success: false; error: string }

export async function subscribeNewsletter(email: string): Promise<SubscribeResult> {
  if (!email || !EMAIL_RE.test(email)) {
    return { success: false, error: 'Ingresá un email válido' }
  }

  await addContactToBrevo(email)
  return { success: true }
}
