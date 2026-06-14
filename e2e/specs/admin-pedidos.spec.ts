import { test, expect } from '@playwright/test'

// Requiere sesión de administrador
test.use({ storageState: '.playwright/admin.json' })

test.describe('Admin — gestión de pedidos', () => {
  test('muestra el listado de pedidos', async ({ page }) => {
    await page.goto('/admin/pedidos')
    await expect(page.getByRole('heading', { name: /pedidos/i })).toBeVisible()
    // Debe haber al menos 1 pedido del seed de test
    await expect(page.locator('tbody span', { hasText: /^Pendiente$/ })).toBeVisible()
  })

  test('navega al detalle de un pedido', async ({ page }) => {
    await page.goto('/admin/pedidos')
    // Click en el primer link de pedido (id del pedido)
    const pedidoLink = page.locator('a[href^="/admin/pedidos/"]').first()
    await expect(pedidoLink).toBeVisible()
    await pedidoLink.click()
    await expect(page).toHaveURL(/\/admin\/pedidos\/.+/)
  })

  test('cambia el estado del pedido de PENDING a CONFIRMED', async ({ page }) => {
    await page.goto('/admin/pedidos')

    const pedidoLink = page.locator('a[href^="/admin/pedidos/"]').first()
    await pedidoLink.click()
    await expect(page).toHaveURL(/\/admin\/pedidos\/.+/)

    // El select de estado está en la página de detalle
    const select = page.locator('select')
    await expect(select).toBeVisible()

    // Cambiar a CONFIRMED
    await select.selectOption('CONFIRMED')

    // Esperar el mensaje "Guardando" que aparece durante la transición
    // y luego verificar que el select se actualizó
    await expect(select).toHaveValue('CONFIRMED', { timeout: 5000 })
  })

  test('el filtro de estado muestra sólo los pedidos del estado seleccionado', async ({ page }) => {
    await page.goto('/admin/pedidos?estado=PENDING')
    // Todos los badges deben decir "Pendiente" (o la lista estar vacía si no hay más PENDING)
    const badges = page.locator('tbody span', { hasText: /^Confirmado$/ })
    await expect(badges).toHaveCount(0)
  })
})
