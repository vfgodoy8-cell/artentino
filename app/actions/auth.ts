'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'

export async function login(_prev: unknown, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { error: 'Email o contraseña incorrectos' }
      }
      return { error: 'Ocurrió un error al iniciar sesión' }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}
