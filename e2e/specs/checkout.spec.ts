import { test, expect } from '@playwright/test'

// Requiere sesión de usuario regular
test.use({ storageState: '.playwright/user.json' })

test.describe('Checkout — carrito y pago', () => {
  test.beforeEach(async ({ page }) => {
    // Agrega el producto al carrito — hay que elegir un color primero
    await page.goto('/catalogo/espejo-led-touch-60cm')
    await page.getByRole('button', { name: 'Azul' }).click()
    const addBtn = page.getByRole('button', { name: /agregar al carrito/i })
    await expect(addBtn).toBeVisible()
    await addBtn.click()
  })

  test('checkout con carrito vacío redirige al catálogo', async ({ page }) => {
    // Limpiar carrito primero vaciando localStorage
    await page.evaluate(() => localStorage.clear())
    await page.goto('/checkout')
    await expect(page.locator('main p', { hasText: 'Tu carrito está vacío' })).toBeVisible()
    await expect(page.locator('main').getByRole('link', { name: /ver catálogo/i })).toBeVisible()
  })

  test('completa el flujo de checkout hasta el pago (mock MP)', async ({ page }) => {
    // Mock del endpoint /api/checkout para no llamar a MercadoPago real
    await page.route('/api/checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ initPoint: 'http://localhost:3001/checkout/success?collection_status=approved&external_reference=test-order' }),
      })
    })

    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()

    // Paso 0: Datos de contacto
    const inputs = page.locator('input')
    await inputs.nth(0).fill('Juan')
    await inputs.nth(1).fill('Pérez')
    await inputs.nth(2).fill('juan@test.com')
    await inputs.nth(3).fill('1112345678')
    await page.getByRole('button', { name: 'Continuar' }).click()

    // Paso 1: Envío (retiro en tienda por defecto)
    await expect(page.getByText('Método de envío')).toBeVisible()
    await page.getByRole('button', { name: 'Continuar' }).click()

    // Paso 2: Método de pago (MercadoPago por defecto)
    await expect(page.getByText('Método de pago')).toBeVisible()
    await page.getByRole('button', { name: 'Ver resumen' }).click()

    // Paso 3: Resumen y pago
    await expect(page.getByText('Resumen del pedido')).toBeVisible()
    await expect(page.getByText('Juan Pérez')).toBeVisible()
    await page.getByRole('button', { name: /pagar con mercadopago/i }).click()

    // El mock redirige a /checkout/success
    await expect(page).toHaveURL(/checkout\/success/)
  })
})
