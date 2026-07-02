import { prisma } from '@/lib/prisma'
import EmailEditor from './email-editor'

export const dynamic = 'force-dynamic'

export default async function AdminEmailsPage() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { key: 'asc' },
    select: {
      id: true,
      key: true,
      name: true,
      subject: true,
      htmlBody: true,
      updatedAt: true,
    },
  })

  const serialized = templates.map((t) => ({
    ...t,
    updatedAt: t.updatedAt.toISOString(),
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Templates de Email</h1>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Editá el asunto y el HTML de los emails automáticos. Usá las variables{' '}
          <span className="font-mono text-[#6b7280]">{'{{variable}}'}</span> para personalizar el contenido.
        </p>
      </div>

      {serialized.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#e5e7eb] py-12 text-center text-sm text-[#9ca3af]">
          No hay templates. Corré <code className="font-mono">npx prisma db seed</code> para crearlos.
        </div>
      ) : (
        <EmailEditor templates={serialized} />
      )}
    </div>
  )
}
