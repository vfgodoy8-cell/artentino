import { test, expect } from '@playwright/test'

function nextWeekday(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  // Ajustar al próximo lunes si cae en fin de semana
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

test.describe('Turnos — reserva de turno', () => {
  test('muestra el formulario de reserva', async ({ page }) => {
    await page.goto('/turnos')
    await expect(page.getByRole('heading', { name: /reservar turno/i })).toBeVisible()
    await expect(page.getByText('Tus datos')).toBeVisible()
    await expect(page.getByText('Modalidad')).toBeVisible()
    await expect(page.getByText('Fecha y horario')).toBeVisible()
  })

  test('validación: muestra errores si se envía vacío', async ({ page }) => {
    await page.goto('/turnos')
    await page.getByRole('button', { name: /confirmar turno/i }).click()
    // Deben aparecer mensajes de error
    await expect(page.getByText('Requerido').first()).toBeVisible()
  })

  test('reserva un turno con datos válidos', async ({ page }) => {
    const fecha = nextWeekday()

    // Mock de slots disponibles para no depender del estado del DB
    await page.route(`/api/turnos/disponibles?date=${fecha}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available: ['09:00', '10:00', '11:00', '12:00'] }),
      })
    })

    // Mock del submit para no crear registros en cada corrida
    await page.route('/api/turnos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('/turnos')

    await page.locator('input[placeholder="María"]').fill('Ana')
    await page.locator('input[placeholder="García"]').fill('López')
    await page.locator('input[placeholder="maria@ejemplo.com"]').fill('ana@test.com')
    await page.locator('input[placeholder="+54 11 1234-5678"]').fill('1112345678')

    // Seleccionar fecha
    await page.locator('input[type="date"]').fill(fecha)

    // Esperar que aparezcan los horarios disponibles
    await expect(page.getByRole('button', { name: '09:00' })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: '09:00' }).click()

    await page.getByRole('button', { name: /confirmar turno/i }).click()

    // Pantalla de éxito
    await expect(page.getByText('¡Turno reservado!')).toBeVisible({ timeout: 8000 })
  })
})
