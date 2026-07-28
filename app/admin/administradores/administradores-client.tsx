'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAdmin, updateAdminRole, setAdminActive } from './actions'
import { useToasts, ToastContainer } from '@/app/ui/toast'

type Admin = {
  id: string
  name: string
  email: string
  adminRole: string | null
  active: boolean
  createdAt: string
}

export default function AdministradoresClient({
  initial,
  currentUserId,
}: {
  initial: Admin[]
  currentUserId: string
}) {
  const router = useRouter()
  const [admins, setAdmins] = useState(initial)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adminRole, setAdminRole] = useState<'SUPERADMIN' | 'ADMIN'>('ADMIN')
  const [creating, setCreating] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const { toasts, pushToast, dismissToast } = useToasts()
  const [, startTransition] = useTransition()

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCreating(true)
    setTempPassword(null)
    try {
      const result = await createAdmin({ name, email, adminRole })
      if (!result.success) {
        pushToast(result.error, 'error')
        return
      }
      setTempPassword(result.data.tempPassword)
      setName('')
      setEmail('')
      setAdminRole('ADMIN')
      router.refresh()
    } finally {
      setCreating(false)
    }
  }

  function handleRoleChange(userId: string, next: 'SUPERADMIN' | 'ADMIN') {
    setAdmins((prev) => prev.map((a) => (a.id === userId ? { ...a, adminRole: next } : a)))
    startTransition(async () => {
      const result = await updateAdminRole(userId, next)
      if (!result.success) pushToast(result.error, 'error')
      router.refresh()
    })
  }

  function handleToggleActive(userId: string, next: boolean) {
    setAdmins((prev) => prev.map((a) => (a.id === userId ? { ...a, active: next } : a)))
    startTransition(async () => {
      const result = await setAdminActive(userId, next)
      if (!result.success) {
        pushToast(result.error, 'error')
        setAdmins((prev) => prev.map((a) => (a.id === userId ? { ...a, active: !next } : a)))
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Crear admin */}
      <form onSubmit={handleCreate} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">Nuevo administrador</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
          />
          <select
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as 'SUPERADMIN' | 'ADMIN')}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="SUPERADMIN">SUPERADMIN</option>
          </select>
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl py-2.5 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#0eb1c3' }}
          >
            {creating ? 'Creando…' : 'Crear'}
          </button>
        </div>

        {tempPassword && (
          <div className="mt-4 rounded-xl border border-[#0eb1c3]/20 bg-[#f0fbfc] p-4 text-sm">
            <p className="font-black text-[#0eb1c3]">Contraseña temporal generada</p>
            <p className="mt-1 text-gray-600">
              Le enviamos un mail con las credenciales. Si no llega (dominio de mail no verificado), pasásela
              vos manualmente: <code className="rounded bg-white px-1.5 py-0.5 font-bold text-[#1E1E1E]">{tempPassword}</code>
            </p>
          </div>
        )}
      </form>

      {/* Listado */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Nombre', 'Email', 'Rol', 'Estado', 'Alta'].map((label) => (
                <th key={label} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-[#1E1E1E]">
                  {admin.name}
                  {admin.id === currentUserId && <span className="ml-2 text-xs text-gray-400">(vos)</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{admin.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={admin.adminRole ?? 'ADMIN'}
                    onChange={(e) => handleRoleChange(admin.id, e.target.value as 'SUPERADMIN' | 'ADMIN')}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-bold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(admin.id, !admin.active)}
                    disabled={admin.id === currentUserId}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      admin.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {admin.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(admin.createdAt).toLocaleDateString('es-AR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
