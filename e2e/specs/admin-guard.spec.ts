import { test, expect } from '@playwright/test'

test.describe('Guard de admin — control de acceso', () => {
  test('anónimo en /admin redirige al login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('anónimo en /admin/productos redirige al login', async ({ page }) => {
    await page.goto('/admin/productos')
    await expect(page).toHaveURL(/\/login/)
  })

  test('anónimo en /api/admin/products devuelve 401', async ({ request }) => {
    const res = await request.post('/api/admin/products', {
      data: { name: 'test' },
    })
    expect(res.status()).toBe(401)
  })

  test('USER en /admin redirige al home', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[name="email"]').fill('user@artentino.test')
    await page.locator('input[name="password"]').fill('User1234!')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await page.waitForURL('/')

    await page.goto('/admin')
    // El middleware redirige USER al home
    await expect(page).toHaveURL('/')
  })

  test('ADMIN accede a /admin correctamente', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[name="email"]').fill('admin@artentino.test')
    await page.locator('input[name="password"]').fill('Admin1234!')
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await page.waitForURL('/')

    await page.goto('/admin')
    await expect(page).toHaveURL('/admin')
    await expect(page.locator('body')).not.toContainText('401')
    await expect(page.locator('body')).not.toContainText('403')
  })
})
