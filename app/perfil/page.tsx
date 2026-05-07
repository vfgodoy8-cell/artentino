import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { name, email } = session.user

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">Mi perfil</h1>
        </div>

        {/* Avatar + name */}
        <div className="mb-6 flex items-center gap-5 rounded-2xl bg-white p-6 shadow-sm">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-black text-white"
            style={{ backgroundColor: '#0eb1c3' }}
          >
            {name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-black text-[#1E1E1E]">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/* Data card */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xs font-black uppercase tracking-wider text-gray-400">Datos de la cuenta</h2>
          <dl className="space-y-4">
            <Row label="Nombre" value={name ?? '—'} />
            <Row label="Email" value={email ?? '—'} />
          </dl>
        </div>

        {/* Quick links */}
        <div className="mb-6 rounded-2xl bg-white shadow-sm">
          <Link
            href="/perfil/pedidos"
            className="flex items-center justify-between px-6 py-4 transition-colors hover:text-[#0eb1c3]"
          >
            <span className="text-sm font-black uppercase tracking-wider text-[#1E1E1E]">Mis pedidos</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-2xl border-2 border-red-100 py-4 text-sm font-black uppercase tracking-widest text-red-500 transition-colors hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
      <dt className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="text-sm font-bold text-[#1E1E1E]">{value}</dd>
    </div>
  )
}
