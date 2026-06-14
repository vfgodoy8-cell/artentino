@AGENTS.md

# Artentino — Contexto del proyecto

E-commerce de deco/hogar argentino. `C:\proyectos\bardot\artentino`.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.5 — App Router, React 19, Turbopack |
| Estilos | Tailwind CSS v4 — `@import "tailwindcss"`, sin `tailwind.config.js` |
| ORM | Prisma 7.8.0 — `prisma-client` generator, sin `url` en datasource, config en `prisma.config.ts` |
| DB producción | PostgreSQL en Railway — `DATABASE_URL` en `.env` |
| DB test | PostgreSQL en Docker puerto 5433 — `DATABASE_URL_TEST` en `.env.test` |
| Auth | NextAuth v5 (`next-auth ^5.0.0-beta.31`) — config en `auth.config.ts`, instancia en `auth.ts` |
| Adaptador DB | `@prisma/adapter-pg` + `pg` |
| Tests E2E | Playwright 1.60 — config en `playwright.config.ts`, specs en `e2e/specs/` |

## Design system

- Teal primario: `#0eb1c3`
- Oscuro: `#1E1E1E`
- Blanco: `#FFFFFF`
- Nunito (body, `--font-nunito`), Dancing Script (logo, `--font-script`)
- **Nunca usar colores nombrados de Tailwind** — siempre hex arbitrario ej. `text-[#1E1E1E]`
- Elementos con hover: usar solo `className` para el color base, nunca `style` inline

## Routing y auth

- Next.js 16 usa `proxy.ts` — `middleware.ts` está **deprecado y eliminado**.
- `proxy.ts` protege `/admin/*` (redirect a login) y `/api/admin/*` (JSON 401/403).

## Páginas y features construidas

- Home: CategoryBar (navega a catálogo filtrado vía `router.push`), Hero, ProductGrid (destacados), PromoCards
- Catálogo `/catalogo` con filtro por categoría (server-rendered con `<Link>`)
- Detalle de producto `/catalogo/[slug]` con combos, qty selector, color selector
- Carrito (localStorage) con CartDrawer en el header
- Checkout multi-step (contacto → envío → pago → resumen) con MercadoPago
- Panel admin: gestión de productos y pedidos con cambio de estado y filtros
- Auth: login, registro, perfil, credenciales NextAuth
- Turnos `/turnos` con slots disponibles vía API
- Contacto `/contacto` con tabs (consulta general / postulación laboral)
- FAQ `/faq`

## Tests E2E (34/34 passing)

```
npm run test:e2e
```

- `e2e/global-setup.ts` — carga `.env.test`, corre `prisma db push --force-reset --url "${testDbUrl}"` y `prisma/seed-test.ts`
- Storagestate: `.playwright/user.json` y `.playwright/admin.json`
- Seed de test: admin (`admin@artentino.test / Admin1234!`) + user (`user@artentino.test / User1234!`) + 2 categorías + 2 productos + 1 orden

## Gotchas críticos

### Prisma 7 CLI
- Leer DB URL desde `prisma.config.ts` (no del schema). Siempre pasar `--url "<url>"` en scripts automatizados para bypasear `prisma.config.ts`.
- `prisma db push` **no acepta** `--skip-generate` en Prisma 7.
- Cuando un agente de IA corre `--force-reset`, Prisma 7 bloquea y exige `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` en el env.

### Playwright strict mode
Aplica a **todas** las assertions, no solo acciones. Traps conocidos en este codebase:

- `getByText('Espejos LED')` → matchea CategoryBar button + ProductCard span. Usar `.first()`.
- `getByRole('link', { name: 'Espejos LED' })` en catálogo → matchea pill + card image link. Usar `a[href="/catalogo?categoria=espejos-led"]`.
- `getByText('Pendiente')` / `getByText('Confirmado')` en admin/pedidos → matchea nav tab + badge. Usar `locator('tbody span', { hasText: /^Pendiente$/ })`.
- `getByText('Tu carrito está vacío')` → matchea mini-cart + checkout content. Usar `.first()`.
- `getByText('Checkout')` → matchea link "Ir al Checkout" + `<h1>`. Usar `getByRole('heading', { name: 'Checkout' })`.
- `getByRole('heading', { name: /contacto/i })` → matchea `<h1>` + `<h3>` del footer. Usar `locator('h1')`.
- `a[href*="/catalogo/"]` en catalog page → puede ser ambiguo. Usar `article a` para product cards.
