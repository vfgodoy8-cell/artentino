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

  test('sin color elegido muestra prompt; color sin stock bloquea la compra', async ({ page }) => {
    await page.goto('/catalogo/espejo-led-touch-60cm')

    // Before selecting any color: informative prompt, button disabled
    await expect(page.getByText('Elegí un color para ver el stock disponible')).toBeVisible()
    const addBtn = page.getByRole('button', { name: /seleccioná un color/i })
    await expect(addBtn).toBeDisabled()

    // Negro has stock 0 — chip should be visually disabled (line-through)
    const negroBtn = page.getByRole('button', { name: 'Negro' })
    await expect(negroBtn).toBeDisabled()

    // Selecting Azul (stock 3) enables the button and shows available units
    await page.getByRole('button', { name: 'Azul' }).click()
    await expect(page.getByText('3 unidades disponibles')).toBeVisible()
    await expect(page.getByRole('button', { name: /agregar al carrito/i })).toBeEnabled()

    // Switching to Verde (stock 1)
    await page.getByRole('button', { name: 'Verde' }).click()
    await expect(page.getByText('1 unidades disponibles')).toBeVisible()
    await expect(page.getByRole('button', { name: /agregar al carrito/i })).toBeEnabled()
  })

  test('seleccionar color cambia la imagen; color sin imagen cae al fallback', async ({ page }) => {
    await page.goto('/catalogo/espejo-led-touch-60cm')
    const img = page.getByAltText('Espejo LED Touch 60cm')
    await expect(img).toBeVisible()
    const defaultSrc = await img.getAttribute('src')
    expect(defaultSrc).toBeTruthy()

    // Azul tiene imagen propia
    await page.getByRole('button', { name: 'Azul' }).click()
    await expect(img).not.toHaveAttribute('src', defaultSrc!)
    const azulSrc = await img.getAttribute('src')

    // Rojo tiene imagen distinta
    await page.getByRole('button', { name: 'Rojo' }).click()
    await expect(img).not.toHaveAttribute('src', azulSrc!)
    await expect(img).not.toHaveAttribute('src', defaultSrc!)

    // Verde no tiene imagen → vuelve a la imagen general
    await page.getByRole('button', { name: 'Verde' }).click()
    await expect(img).toHaveAttribute('src', defaultSrc!)
  })
})
