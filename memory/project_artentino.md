---
name: project-artentino
description: "Artentino e-commerce — tech stack, design system, DB, current UI state and component inventory (updated 2026-07-13)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6d7a1ecb-f10c-42b0-9aad-0eb35639be0a
---

Argentine deco/home goods e-commerce site at `C:\proyectos\bardot\artentino`.

**Stack:**
- Next.js 16.2.5 (App Router, React 19, Turbopack)
- Tailwind CSS v4 (`@tailwindcss/postcss ^4`) — uses `@import "tailwindcss"`, NO tailwind.config.js
- Prisma 7.8.0 — `provider = "prisma-client"`, no `url` in datasource, PrismaClient requires adapter, config in `prisma.config.ts`
- PostgreSQL on Railway (`DATABASE_URL` in `.env`) + local Docker test DB on port 5433 (`DATABASE_URL_TEST` in `.env.test`)
- `@prisma/adapter-pg` + `pg` for direct DB connections
- NextAuth v5 (`next-auth ^5.0.0-beta.31`) — auth config in `auth.config.ts`, instance in `auth.ts`
- Playwright 1.60 for E2E tests — config in `playwright.config.ts`, tests in `e2e/specs/`, globalSetup in `e2e/global-setup.ts`

**Design system:**
- Primary teal: `#0eb1c3`
- Dark: `#1E1E1E`
- White: `#FFFFFF`
- Fonts: Nunito (body, CSS var `--font-nunito`), Dancing Script (logo, CSS var `--font-script`)

**Routing / auth:**
- Next.js 16 uses `proxy.ts` (NOT `middleware.ts` — deprecated). `proxy.ts` protects `/admin/*` and `/api/admin/*` with JSON 401/403 for API routes and redirect for pages.
- `middleware.ts` was deleted (was causing "Both middleware.ts and proxy.ts detected" startup error).

---

## lib/prisma.ts — Pool configurado (fix P1017)

`pg.Pool` con `max:5, idleTimeoutMillis:10000, connectionTimeoutMillis:10000` en vez de bare connectionString.
`pool.on('error', ...)` absorbe el error async cuando Railway cierra conexiones TCP inactivas.
Evita P1017 / DriverAdapterError: ConnectionClosed en Vercel warm functions.

---

## app/lib/cloudinary.ts

```typescript
export function cloudinaryThumb(url: string): string {
  return url.replace('/upload/', '/upload/c_fill,ar_1:1,g_auto/')
}
```
Inserta transformación Cloudinary para recorte 1:1 server-side. Importar donde se usen imágenes de cards.

---

## Schema — categorías — DOS NIVELES

```prisma
model Category {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  order         Int           @default(0)
  isSpecial     Boolean       @default(false)
  subcategories Subcategory[]
  heroBadges    HeroBadge[]
  @@map("categories")
}

model Subcategory {
  id         String    @id @default(cuid())
  name       String
  slug       String    @unique
  order      Int       @default(0)
  categoryId String
  category   Category  @relation(...)
  products   Product[]
  @@map("subcategories")
}
```

- `Product.categoryId` → apunta a `Subcategory` (no a Category)
- `HeroBadge.categoryId` → apunta a `Category` padre
- Filtros catálogo: `category: { category: { slug } }` para padre; `category: { slug }` para subcategoría

---

## Schema — ProductRelation

Relación N-to-N self-referencial en Product:

```prisma
model ProductRelation {
  id               String   @id @default(cuid())
  productId        String
  relatedProductId String
  sortOrder        Int      @default(0)
  createdAt        DateTime @default(now())
  @@unique([productId, relatedProductId])
  @@map("product_relations")
}
```

---

## Schema — Order / OrderItem

```prisma
enum OrderStatus {
  PENDING
  PENDING_PICKUP_PAYMENT   // pago en tienda con efectivo o transferencia
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
  status         OrderStatus @default(PENDING)
  paymentMethod  String?     // 'mercadopago' | 'cash' | 'transfer'
}

model OrderItem {
  id               String          @id @default(cuid())
  orderId          String
  order            Order           @relation(...)
  productId        String
  product          Product         @relation(...)
  quantity         Int
  price            Decimal         @db.Decimal(10, 2)
  attributeValueId String?                              // nullable — persiste la variante elegida
  attributeValue   AttributeValue? @relation(...)
  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}
```

`attributeValueId` es nullable para no romper pedidos existentes. Se guarda en `OrderItem.create` en ambos flows (cash/transfer y MercadoPago) cuando el CartItem lo trae del frontend.

---

## Constantes compartidas (`app/lib/constants.ts`)

```typescript
export const CASH_DISCOUNT = 0.25      // factor de descuento
export const CASH_DISCOUNT_PCT = 25    // número para mostrar en UI
```

Siempre importar desde aquí, nunca hardcodear el número.

---

## lib/serialize.ts — serializeProduct

Genérico que serializa `Decimal` → `Number` y `Date` → `string ISO`. También serializa `comboPrices?` opcionales:

```typescript
...(p.comboPrices && {
  comboPrices: p.comboPrices.map((c) => ({ ...c, price: Number(c.price.toString()) })),
}),
```

---

## UI State — ProductCard (`app/ui/product-card.tsx`)

- `aspect-square` (era `aspect-[3/4]`)
- Imagen: `cloudinaryThumb(imageUrl)` para recorte 1:1 server-side
- Bloque de precio:
  ```
  EFECTIVO / TRANSFERENCIA   ← label teal text-[9px] uppercase tracking-wider
  $XXXX  $YYYY               ← cash price text-xl font-black teal + list price text-xl font-black dark (flex-wrap items-baseline)
  6x $ZZZ sin interés        ← cuotas sobre precio de lista, text-right
  ```
- No muestra `comparePrice` tachado

---

## UI State — ProductGrid (`app/ui/product-grid.tsx`)

Grid de destacados: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (4ta columna en lg+).

---

## UI State — Catálogo

### `app/catalogo/page.tsx` — RSC

Layout: header atmosférico full-width → `flex gap-10` → sidebar (lg+) + `div flex-1` (pills mobile + grid).

### CategorySidebar (`app/catalogo/category-sidebar.tsx`) — desktop

Sticky, grupos padre colapsables, subcategorías indentadas.

### CategoryPills (`app/catalogo/category-pills.tsx`) — mobile

Scroll horizontal con flechas ‹ ›. Pills split (body navega, caret expande subcategorías).

---

## UI State — Detalle de producto

### `product-detail-shell.tsx`

- h1: `font-bold` (era `font-black`)
- Bloque de precio (dos columnas `flex-col sm:flex-row items-start`):
  ```
  [PAGANDO EFECTIVO O TRANSFERENCIA]     [PRECIO DE LISTA]
  $X.XXX  [25% OFF]                      $Y.YYY
                                          6x $Z.ZZZ sin interés
  ```
  - Columna izquierda: label teal `text-sm font-black uppercase` + precio cash `text-5xl font-bold text-[#0eb1c3]` + pill `{CASH_DISCOUNT_PCT}% OFF`
  - Columna derecha: label gris `text-sm font-black uppercase` + precio lista `text-5xl font-bold text-[#1E1E1E]` + cuotas `text-sm text-gray-400`
  - **Ambos precios: `font-bold` (700), NO `font-black` (900)**
  - Layout: `flex-col items-start gap-y-3 sm:flex-row sm:items-start sm:gap-x-6`

### `product-gallery.tsx`

- Flechas prev/next superpuestas en imagen principal (`bg-white/80 backdrop-blur-sm`, centradas verticalmente)
- Loop: `goToIdx()` con módulo envuelto
- Touch swipe: `onTouchStart/onTouchEnd`, umbral 50px
- Oculta flechas si solo hay 1 ítem

### `product-actions.tsx`

- Combo table header: label + subtítulo "Son acumulables con el {CASH_DISCOUNT_PCT}% OFF Efectivo - Transferencia!"
- Botón principal: cuando `disabledReason === 'no-color'` → dos chevron-up SVG flanqueando "Seleccioná una variante"

---

## FAQ (`app/faq/page.tsx`)

Botón Email: `border-gray-200 text-gray-600 hover:border-[#0eb1c3] hover:text-[#0eb1c3]`, sin `hover:bg` ni inline style.

---

## Admin — Productos (`/admin/productos`)

- Query incluye `comboPrices: { orderBy: { quantity: 'asc' } }`
- Tabla: columnas "Precio Pack 1" (idx 0) y "Precio Pack 2" (idx 1)

---

## Checkout — métodos de pago

### `app/checkout/checkout-client.tsx`

- `PaymentMethod = 'mercadopago' | 'cash' | 'transfer' | 'modo'`
- Step 2: **dos radios separados** "Efectivo" y "Transferencia bancaria", ambos con badge 25% OFF, solo cuando shipping === 'pickup'
- `isCashOrTransfer = payment === 'cash' || payment === 'transfer'`
- Al cambiar a delivery se resetea `cash`/`transfer` → `mercadopago`
- Al confirmar navega a `/checkout/confirmado?method=${payment}`

### `app/api/checkout/route.ts`

- Branch para cash/transfer: `if (paymentMethod === 'cash' || paymentMethod === 'transfer')`
- Guarda el valor exacto (`'cash'` o `'transfer'`) en `Order.paymentMethod`
- Lookup batch de `attributeValue.value` antes del email para resolver nombres de variante
- Ambos flows incluyen `attributeValueId` en `OrderItem.create`
- Status: `PENDING_PICKUP_PAYMENT` para cash/transfer, `PENDING` para MP

### `app/checkout/confirmado/page.tsx`

Lee `searchParams.method` y muestra:
- `'cash'`: "Efectivo", dirección del local, leyenda Showroom
- `'transfer'`: "Transferencia bancaria", tarjetas de cuentas (MP alias **artentino** CVU 0000003100132288095792; Supervielle alias **artentinosuper** CBU 0270020510037812120025), link WhatsApp, leyenda Showroom
- `'cash_transfer'` (legacy): texto genérico
- Bloque "Descuento aplicado 25% OFF" en los tres casos

---

## CartDrawer

Banner `bg-[#f0fbfc]`: "Pagando en efectivo o transferencia, tenés {CASH_DISCOUNT_PCT}% OFF"

---

## CartAddPopup

- Observa `addCount`, abre popup al incrementar
- Countdown 5 min (300s) `mm:ss`

---

## Admin — Relacionados

Tab en `/admin/productos/[id]/editar`: search con debounce 350ms.

---

## Admin — Pedidos

### STATUS dict (ambos archivos `page.tsx` y `[id]/page.tsx`)

```typescript
const STATUS = {
  PENDING:                { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  PENDING_PICKUP_PAYMENT: { label: 'A retirar',  bg: '#EDE9FE', color: '#7C3AED' },
  CONFIRMED:              { label: 'Confirmado', bg: '#CCFBF4', color: '#0eb1c3' },
  SHIPPED:                { label: 'Enviado',    bg: '#DBEAFE', color: '#2563EB' },
  DELIVERED:              { label: 'Entregado',  bg: '#D1FAE5', color: '#059669' },
  CANCELLED:              { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
}
```

### Vista detalle `[id]/page.tsx`

- Include: `items: { include: { product: { select: { name, slug, imageUrl } }, attributeValue: { select: { value } } } }`
- Formato item: nombre del producto + `"{Color} · x{cantidad}"` en línea secundaria
- Sidebar: tarjeta "Método de pago" con label legible (Efectivo / Transferencia bancaria / MercadoPago)

---

## Email (`app/lib/email.ts`)

### `pickupCashEmail({ name, items, total, discountPct, paymentMethod })`

- `items: Array<{ name, quantity, price, variantName? }>` — muestra "Producto · Color" en tabla
- `paymentMethod: 'cash' | 'transfer'` — diferencia el texto de la sección "Método de pago"

### `purchaseConfirmationEmail({ name, items, total, shipping })`

- `items: Array<{ name, quantity, price, variantName? }>` — mismo formato

---

## Microanimaciones

keyframes en `app/globals.css`: `cart-bounce`, `toast-in`, `gallery-fade`, `hero-text-in`, `popup-in`

---

## Assets / WhatsApp

- `app/icon.png` — favicon actual
- WhatsApp botón flotante: `app/ui/whatsapp-button.tsx` → `href="https://wa.me/5491139363333"`
- Footer: `href="https://api.whatsapp.com/send?phone=5491139363333"`
- Número: +54 9 11 3936 3333

---

**Why:** Complete e-commerce for Argentine home goods brand.
**How to apply:** Peso formatting `toLocaleString('es-AR')`, teal `#0eb1c3` as primary, Prisma 7 + Tailwind v4 + Next.js 16 conventions. Never use `middleware.ts`. Products→Subcategory for categoryId. Discount constants always from `app/lib/constants.ts`. Never inline `style={{ color }}` on hover elements. PaymentMethod: `'cash'`, `'transfer'`, `'mercadopago'` (legacy `'cash_transfer'` may exist). OrderItem.attributeValueId always include in OrderItem.create. Price numbers in product detail: `font-bold` (700) NOT `font-black`.
