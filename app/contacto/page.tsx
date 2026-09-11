import Link from 'next/link'
import { getSiteContact } from '@/app/lib/site-contact'
import ContactForm from './contact-form'

export default async function ContactoPage() {
  const contact = await getSiteContact()

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-semibold text-[#9ca3af] transition-colors hover:text-[#0eb1c3]"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">Contacto</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            ¿Tenés una consulta? Completá el formulario o contactanos por mail a{' '}
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-[#0eb1c3] transition-opacity hover:opacity-70"
            >
              {contact.email}
            </a>
          </p>
        </div>

        <ContactForm />
      </div>
    </main>
  )
}
