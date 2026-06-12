import { test, expect } from '@playwright/test'

test.describe('Autenticación — registro, login y protección de rutas', () => {
  test('login exitoso redirige al home', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[name="email"]').fill('user@artentino.test')
    await page.locator('input[name="password"]').fill('User1234!')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })

  test('login con credenciales inválidas muestra error', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[name="email"]').fill('user@artentino.test')
    await page.locator('input[name="password"]').fill('contraseniaincorrecta')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    // NextAuth v5 con credentials muestra error en la misma página
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 5000 })
  })

  test('registro de nuevo usuario', async ({ page }) => {
    await page.goto('/registro')
    await page.locator('input[name="name"]').fill('Nuevo Usuario')
    await page.locator('input[name="email"]').fill('nuevo@artentino.test')
    await page.locator('input[name="phone"]').fill('1199887766')
    await page.locator('input[name="password"]').fill('Nuevo1234!')
    await page.getByRole('button', { name: 'Crear cuenta' }).click()
    // Después del registro hace auto-login y redirige al home
    await page.waitForURL('/', { timeout: 10_000 })
    await expect(page).toHaveURL('/')
  })

  test('/perfil sin auth redirige al login', async ({ page }) => {
    await page.goto('/perfil')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/perfil con auth muestra la página', async ({ page, context }) => {
    // Login manual para este test individual
    await page.goto('/login')
    await page.locator('input[name="email"]').fill('user@artentino.test')
    await page.locator('input[name="password"]').fill('User1234!')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await page.waitForURL('/')

    await page.goto('/perfil')
    // La página de perfil no debe redirigir al login
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.locator('body')).toBeVisible()
  })
})
