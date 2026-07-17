@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce de deco/hogar argentino. App Router + Prisma 7 + NextAuth v5. Hay un panel admin completo, carrito en localStorage, checkout con MercadoPago, y suite E2E de 34 tests.

**Páginas:** Home · `/catalogo` · `/catalogo/[slug]` · `/checkout` · `/turnos` · `/contacto` · `/faq` · `/admin/*` · `/login` · `/registro` · `/perfil`

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
| Imágenes | Cloudinary — upload vía `app/api/admin/upload/route.ts` |
| Emails | Resend — `app/lib/email.ts` |
| Tests E2E | Playwright 1.60 — config en `playwright.config.ts`, specs en `e2e/specs/` |

---

## Comandos

```bash
npm run dev                  # dev server en :3000 (Turbopack)
npm run build                # prisma generate + next build
npm run lint                 # eslint
npm run test:e2e             # Playwright — resetea la DB de test primero
npm run test:e2e:ui          # Playwright con UI interactiva
npx playwright test e2e/specs/catalogo.spec.ts   # un spec específico
```

Push de schema a la DB de test (nunca omitir `--url`):
```bash
npx prisma db push --url "$DATABASE_URL_TEST"
```

---

## Arquitectura

### Routing y auth

- Next.js 16 usa `proxy.ts` en la raíz — `middleware.ts` está **eliminado** (causaba conflicto de arranque).
- `proxy.ts` wrappea `auth()` de NextAuth y protege `/admin/*` (redirect a `/login`) y `/api/admin/*` (JSON 401/403).
- `auth.config.ts` — callbacks JWT/session + config de páginas, sin acceso a DB (apto para proxy).
- `auth.ts` — instancia completa con Credentials provider + bcrypt + DB. No importar en proxy.

### PrismaClient

`lib/prisma.ts` instancia `PrismaClient` con `PrismaPg` adapter (obligatorio en Prisma 7, ya que el datasource no tiene `url`). El cliente generado vive en `app/generated/prisma/` — importar desde `@/app/generated/prisma/client`.

### Patrón de admin

Páginas en `app/admin/` son RSC. Mutaciones vía Server Actions definidas en `actions.ts` co-ubicados. Las tablas son Client Components; los formularios usan `useActionState`.

### Carrito

`app/context/cart-context.tsx` — estado global en localStorage. `CartDrawer` en el header. El checkout lee el carrito del context.

---

## Convenciones de código

### Design system
- Teal primario: `#0eb1c3` · Oscuro: `#1E1E1E` · Blanco: `#FFFFFF`
- Fuentes: Nunito (`--font-nunito`, body), Dancing Script (`--font-script`, logo)
- **Nunca usar colores nombrados de Tailwind** — siempre hex arbitrario: `text-[#1E1E1E]`, `bg-[#0eb1c3]`
- Elementos con hover: color base solo en `className`, nunca en `style` inline

### Serialización RSC → Client
Usar `lib/serialize.ts` para pasar datos de Server Components a Client Components (convierte tipos no serializables como `Decimal` y `Date`).

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
- `getByRole('heading', { name: /contacto/i })` → matchea `<h1>` + `<h3>` del footer. Usar `locator('h1')`.
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
