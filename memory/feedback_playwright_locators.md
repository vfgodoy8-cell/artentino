---
name: feedback-playwright-locators
description: Playwright strict mode pitfalls specific to this codebase — selectors that match multiple elements
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 88364ef3-f9d7-4ee7-8673-883c5f956f67
---

Playwright 1.60 enforces strict mode on ALL locator assertions (`toBeVisible`, `toHaveCount`, etc.), not just actions. A locator matching 2+ elements fails even on `toBeVisible()`.

**Why:** Discovered while fixing 8 failing E2E tests. The DOM has overlapping text in multiple places.

**How to apply — known multi-match traps in this codebase:**

- `getByText('Espejos LED')` on home or catalog pages → matches CategoryBar button AND ProductCard `<span>` inside the image Link. Use `getByRole('button', { name: 'Espejos LED' })` — CategoryBarPills renders `<button>` elements, ProductCard category badge is a `<span>` so role scopes uniquely.
- `getByRole('link', { name: /ver catálogo/i })` on checkout page → CartDrawer also renders a "Ver catálogo" `<Link>` (outside `<main>`, in the Header) even when drawer is closed. Use `page.locator('main').getByRole('link', { name: /ver catálogo/i })` to scope to the checkout content area.
- `getByRole('link', { name: 'Espejos LED' })` on catalog page → matches category filter pill AND product card image Link (which contains the category span). Use `a[href="/catalogo?categoria=espejos-led"]` instead.
- `getByText('Pendiente')` / `getByText('Confirmado')` on admin/pedidos → matches nav tab Links AND status badge `<span>` in table rows. Scope to `page.locator('tbody span', { hasText: /^Pendiente$/ })`.
- `getByText('Tu carrito está vacío')` on checkout page → matches mini-cart element AND main checkout content (two separate `<p>` tags). Use `.first()`.
- `getByText('Checkout')` → matches nav link "Ir al Checkout" (substring) AND `<h1>Checkout</h1>`. Use `getByRole('heading', { name: 'Checkout' })`.
- `getByText('Espejo LED Touch 60cm')` on detail page → matches breadcrumb `<span>` AND `<h1>`. Use `getByRole('heading', { name: '...' })`.
- `getByRole('heading', { name: /contacto/i })` → matches `<h1>` AND footer `<h3>Contacto</h3>`. Use `page.locator('h1')`.
- `getByText(/\$\d/)` on product detail → matches main price AND installment line. Use `.first()`.
- `a[href*="/catalogo/"]` on catalog page → can match non-product links. Use `article a` scoped to product card elements.
