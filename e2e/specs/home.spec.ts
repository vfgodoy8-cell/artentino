import { test, expect } from '@playwright/test'

test.describe('Home — destacados y categorías', () => {
  test('muestra productos destacados', async ({ page }) => {
    await page.goto('/')
    // La grilla de destacados usa ProductCard con links a /catalogo/[slug]
    const productLinks = page.locator('a[href^="/catalogo/"]')
    await expect(productLinks.first()).toBeVisible()
  })

  test('muestra la barra de categorías con Espejos LED', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Espejos LED')).toBeVisible()
  })

  test('el link de una categoría navega al catálogo filtrado', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Espejos LED').first().click()
    await expect(page).toHaveURL(/\/catalogo\?categoria=espejos-led/)
  })
})
