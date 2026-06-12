import { test, expect } from '@playwright/test'

test.describe('Contacto — formulario de consulta', () => {
  test('muestra el formulario con tabs de consulta y postulación', async ({ page }) => {
    await page.goto('/contacto')
    await expect(page.getByRole('heading', { name: /contacto/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /consulta general/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /postulación laboral/i })).toBeVisible()
  })

  test('validación: errores en consulta general vacía', async ({ page }) => {
    await page.goto('/contacto')
    await page.getByRole('button', { name: /enviar mensaje/i }).click()
    await expect(page.getByText('Requerido').first()).toBeVisible()
  })

  test('envío exitoso de consulta general', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/contacto')

    await page.locator('input[placeholder="Tu nombre"]').fill('Carlos')
    await page.locator('input[placeholder="tu@email.com"]').fill('carlos@test.com')
    await page.locator('textarea').fill('Quiero información sobre los espejos.')

    await page.getByRole('button', { name: /enviar mensaje/i }).click()
    await expect(page.getByText('¡Mensaje enviado!')).toBeVisible({ timeout: 5000 })
  })

  test('switch al tab de postulación laboral', async ({ page }) => {
    await page.goto('/contacto')
    await page.getByRole('button', { name: /postulación laboral/i }).click()
    await expect(page.getByText(/puesto al que te postulás/i)).toBeVisible()
  })

  test('envío exitoso de postulación laboral', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/contacto')
    await page.getByRole('button', { name: /postulación laboral/i }).click()

    await page.locator('input[placeholder="Tu nombre"]').fill('Laura')
    await page.locator('input[placeholder="tu@email.com"]').fill('laura@test.com')
    await page.locator('input[placeholder*="Vendedor"]').fill('Diseñadora')
    await page.locator('textarea').fill('Tengo experiencia en diseño de interiores.')

    await page.getByRole('button', { name: /enviar mensaje/i }).click()
    await expect(page.getByText('¡Mensaje enviado!')).toBeVisible({ timeout: 5000 })
  })
})
