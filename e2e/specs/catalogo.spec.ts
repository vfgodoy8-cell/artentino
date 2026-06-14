import { test, expect } from '@playwright/test'

test.describe('Catálogo — listado, filtro y detalle', () => {
  test('muestra productos en el catálogo', async ({ page }) => {
    await page.goto('/catalogo')
    await expect(page.getByRole('heading', { name: /catálogo/i })).toBeVisible()
    const productLinks = page.locator('a[href^="/catalogo/"]')
    await expect(productLinks.first()).toBeVisible()
  })

  test('filtra por categoría al hacer click en el pill', async ({ page }) => {
    await page.goto('/catalogo')
    await page.locator('a[href="/catalogo?categoria=espejos-led"]').click()
    await expect(page).toHaveURL(/categoria=espejos-led/)
    await expect(page.getByRole('heading', { name: 'Espejos LED' })).toBeVisible()
    await expect(page.getByText('Espejo LED Touch 60cm')).toBeVisible()
  })

  test('el catálogo filtrado no muestra productos de otra categoría', async ({ page }) => {
    await page.goto('/catalogo?categoria=espejos-led')
    await expect(page.getByText('Lámpara de Pie Negra')).not.toBeVisible()
  })

  test('navega al detalle del producto', async ({ page }) => {
    await page.goto('/catalogo')
    await expect(page.locator('article').first()).toBeVisible()
    await page.locator('article a').first().click()
    await expect(page).toHaveURL(/\/catalogo\/.+/)
    // La página de detalle muestra el precio
    await expect(page.getByText(/\$\d/).first()).toBeVisible()
  })

  test('la página de detalle del espejo muestra el producto', async ({ page }) => {
    await page.goto('/catalogo/espejo-led-touch-60cm')
    await expect(page.getByRole('heading', { name: 'Espejo LED Touch 60cm' })).toBeVisible()
    await expect(page.getByText('$266.000')).toBeVisible()
  })
})
