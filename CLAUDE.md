@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce de deco/hogar argentino (Artentino). App Router + Prisma 7 + NextAuth v5. Tiene panel admin completo, carrito en localStorage, checkout con MercadoPago (webhook IPN), y suite E2E de 34 tests.

**Páginas públicas:** Home · `/catalogo` · `/catalogo/[slug]` · `/checkout` · `/turnos` · `/contacto` · `/faq` · `/login` · `/registro` · `/perfil` · `/perfil/pedidos`

**Panel admin** (`/admin/*`): Productos · Categorías · Atributos · Destacados · Pedidos · Turnos · Contactos

---

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
| Pagos | MercadoPago SDK v2 — preferencia en `/api/checkout`, webhook IPN en `/api/webhook/mercadopago` |
| Imágenes | Cloudinary — upload vía `app/api/admin/upload/route.ts` |
| Emails | Resend — `app/lib/email.ts`, disparado desde webhook al confirmar pago |
| Tests E2E | Playwright 1.60 — config en `playwright.config.ts`, specs en `e2e/specs/` |
| CI | GitHub Actions — `.github/workflows/e2e.yml` corre `npm run test:e2e` |

---

## Comandos

```bash
npm run dev                                          # dev server en :3000 (Turbopack)
npm run build                                        # prisma generate + next build
npm run lint                                         # eslint
npm run test:e2e                                     # Playwright — resetea la DB de test primero
npm run test:e2e:ui                                  # Playwright con UI interactiva
npx playwright test e2e/specs/catalogo.spec.ts       # un spec específico
```

Push de schema a la DB de test (nunca omitir `--url`):
```bash
npx prisma db push --url "$DATABASE_URL_TEST"
```

Seed de producción:
```bash
npx prisma db seed
```

---

## Arquitectura

### Layout raíz

`app/layout.tsx` monta en orden: `Marquee` (barra de texto promocional) → `Header` (con `CartDrawer`) → `<main>` → `Footer` → `WhatsAppButton` (flotante). Todo envuelto en `<Providers>` (SessionProvider de NextAuth).

### Routing y auth

- Next.js 16 usa `proxy.ts` en la raíz — `middleware.ts` está **eliminado** (causaba error de arranque al coexistir).
- `proxy.ts` wrappea `auth()` de NextAuth. Matcher: `/admin/:path*` y `/api/admin/:path*`.
  - Sin sesión → redirect a `/login?callbackUrl=...` (páginas) o JSON 401 (API).
  - Sesión con `role !== 'ADMIN'` → redirect a `/` (páginas) o JSON 403 (API).
- `auth.config.ts` — callbacks JWT/session + config de páginas, sin acceso a DB (importable en proxy).
- `auth.ts` — instancia completa con Credentials provider + bcrypt + DB. No importar en `proxy.ts`.
- La sesión expone `user.id` y `user.role` (`USER` | `ADMIN`) vía callbacks JWT.

### PrismaClient

`lib/prisma.ts` instancia `PrismaClient` con `PrismaPg` adapter (obligatorio en Prisma 7 — el datasource no tiene `url`). El cliente generado vive en `app/generated/prisma/` — importar siempre desde `@/app/generated/prisma/client`. No editar los archivos generados.

### Flujo de checkout

1. `app/checkout/checkout-client.tsx` — formulario multi-step client-side (contacto → envío → pago → resumen).
2. Requiere sesión activa (`/api/checkout` retorna 401 si no hay user).
3. `POST /api/checkout` crea un `Order` en DB (status `PENDING`), luego llama a MercadoPago para crear la preferencia. Si MP falla, hace rollback del Order.
4. El usuario es redirigido al init point de MP. Al pagar, MP llama `POST /api/webhook/mercadopago`.
5. El webhook verifica el pago con la API de MP, mapea el status (`approved` → `CONFIRMED`, `rejected`/`cancelled` → `CANCELLED`), actualiza el Order y — si confirmado — dispara un email de confirmación vía Resend (fire-and-forget, no bloquea la respuesta). El webhook es idempotente: ignora si el Order ya tiene el status destino.

### Patrón de admin

- Páginas en `app/admin/` son RSC; las tablas son Client Components.
- Mutaciones vía Server Actions en `actions.ts` co-ubicados. Siempre terminan con `revalidatePath()` para invalidar el caché RSC (incluyendo `revalidatePath('/')` cuando el cambio afecta el home, ej. destacados).
- El editor de producto (`/admin/productos/[id]/editar`) tiene 3 tabs: **Información** (precios, combos, descripción), **Stock** (por atributo/variante), **Imágenes** (Cloudinary).
- Nuevo producto: el slug se genera automáticamente a partir del SKU.

### Carrito y catálogo

- `app/context/cart-context.tsx` — estado global en localStorage. `CartDrawer` vive en el `Header`.
- `CategoryBarPills` (home) navega con `router.push` a `/catalogo?categoria=<slug>`. `CategoryBar` le pasa objetos `{ name, slug }` desde la DB.
- `product-grid.tsx` ordena destacados por `[sortOrder asc, createdAt desc]` para desempatar productos con el mismo sortOrder.

### CategoryPills — drill-down de dos niveles (`app/catalogo/category-pills.tsx`)

- **Nivel raíz:** muestra "Todos" + pill "Espejos" (split body/caret) + categorías sueltas. Las 8 subcategorías `espejos-*` no aparecen aquí.
- **Nivel espejos:** al tocar el caret `›`, la barra se reemplaza por `‹ Volver` + las 8 subcategorías. Estado local `'root' | 'espejos'`, sin cambio de URL.
- **Pill "Espejos" — comportamiento híbrido:** cuerpo navega a `/catalogo?categoria=espejos`; caret entra al sub-nivel.
- **Sentinel `?categoria=espejos`:** `page.tsx` detecta este slug ficticio y filtra con `category: { slug: { startsWith: 'espejos-' } }` en Prisma. El h1 muestra "Espejos".
- **Agrupación dinámica:** constante `ESPEJOS_PREFIX = 'espejos-'` — si se agregan más categorías `espejos-*` a la DB, se agrupan automáticamente.
- **Auto-entrada al sub-nivel:** si `activeSlug.startsWith('espejos-')`, el componente inicializa en nivel `'espejos'` (cold load) y sincroniza por `useEffect([activeSlug])` (client-side nav).

### Detalle de producto — caminos de compra (`app/catalogo/[slug]/`)

Dos caminos **mutuamente excluyentes**:
- **Por unidad (con color):** `disabled` y `disabledReason` se computan en `product-detail-shell.tsx` y se pasan a `ProductActions`. El botón principal hereda `disabled`; muestra "Seleccioná un color" cuando `disabledReason === 'no-color'`.
- **Por pack (surtido):** botones Pack x4/x24 **siempre habilitados** — no reciben el prop `disabled`. Al clickear un pack con color elegido: `onClearColor()` (prop callback) limpia `selectedColorId` en el shell E incrementa `colorResetKey`, que está como `key` en `<ProductGallery>` → re-monta el subárbol, reseteando visualmente `VariantSelector` y `selectedIds` de la galería.

### Serialización RSC → Client

`lib/serialize.ts` convierte tipos no serializables (`Decimal`, `Date`) antes de pasar datos de Server Components a Client Components.

---

## Convenciones de código

### Design system
- Teal primario: `#0eb1c3` · Oscuro: `#1E1E1E` · Blanco: `#FFFFFF`
- Fuentes: Nunito (`--font-nunito`, body), Dancing Script (`--font-script`, logo)
- **Nunca usar colores nombrados de Tailwind** — siempre hex arbitrario: `text-[#1E1E1E]`, `bg-[#0eb1c3]`
- Elementos con hover: color base solo en `className`, nunca en `style` inline

---

## Gotchas críticos

### Prisma 7 CLI
- `prisma.config.ts` tiene `import "dotenv/config"` que carga `.env` (URL de prod). Siempre pasar `--url "<url>"` en scripts para bypasear.
- `prisma db push` **no acepta** `--skip-generate` en Prisma 7.
- Cuando un agente de IA corre `--force-reset`, Prisma 7 bloquea y exige `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` en el env del proceso.

### Playwright strict mode
Aplica a **todas** las assertions, no solo acciones. Traps conocidos en este codebase:

- `getByText('Espejos LED')` → matchea CategoryBar button + ProductCard span. Usar `.first()`.
- `getByRole('link', { name: 'Espejos LED' })` en catálogo → matchea pill + card image link. Usar `a[href="/catalogo?categoria=espejos-led"]`.
- `getByText('Pendiente')` / `getByText('Confirmado')` en admin/pedidos → matchea nav tab + badge. Usar `locator('tbody span', { hasText: /^Pendiente$/ })`.
- `getByText('Tu carrito está vacío')` → matchea mini-cart + checkout content. Usar `.first()`.
- `getByText('Checkout')` → matchea link "Ir al Checkout" + `<h1>`. Usar `getByRole('heading', { name: 'Checkout' })`.
- `getByRole('heading', { name: /contacto/i })` → matchea `<h1>` + `<h3>` del footer. Usar `page.locator('h1')`.
- `a[href*="/catalogo/"]` en catalog page → puede ser ambiguo. Usar `article a` para product cards.

---

## Tests E2E — infraestructura

```bash
npm run test:e2e   # 34/34 passing
```

- `e2e/global-setup.ts` — carga `.env.test`, corre `prisma db push --force-reset --url "${testDbUrl}"` y `prisma/seed-test.ts`
- `e2e/auth.setup.ts` — genera `.playwright/user.json` y `.playwright/admin.json`
- El webServer arranca en el puerto **3001** con las vars de `.env.test`
- Seed: admin (`admin@artentino.test / Admin1234!`) + user (`user@artentino.test / User1234!`) + 2 categorías + 2 productos + 1 orden
