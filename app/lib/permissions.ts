import type { Session } from 'next-auth'

export type AdminRole = 'SUPERADMIN' | 'ADMIN'

/**
 * Corta la ejecución de una Server Action si el usuario de la sesión no tiene
 * uno de los roles permitidos. Es la protección real — ocultar botones en la UI
 * es solo cosmético.
 */
export function requireRole(session: Session | null, allowedRoles: AdminRole[]): void {
  const role = (session?.user as { role?: string } | undefined)?.role
  const adminRole = (session?.user as { adminRole?: string | null } | undefined)?.adminRole

  if (role !== 'ADMIN' || !adminRole || !allowedRoles.includes(adminRole as AdminRole)) {
    throw new Error('No tenés permisos para realizar esta acción')
  }
}
