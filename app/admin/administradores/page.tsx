import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdministradoresClient from './administradores-client'

export default async function AdminAdministradoresPage() {
  const session = await auth()
  const adminRole = (session?.user as { adminRole?: string } | undefined)?.adminRole
  if (adminRole !== 'SUPERADMIN') redirect('/admin')

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, adminRole: true, active: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Administradores</h1>
        <p className="mt-1 text-sm text-gray-400">
          Gestioná quién tiene acceso al panel de administración y con qué rol.
        </p>
      </div>
      <AdministradoresClient
        initial={admins.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
        currentUserId={session!.user!.id!}
      />
    </div>
  )
}
