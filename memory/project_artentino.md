---
name: project-artentino
description: "Artentino e-commerce — tech stack, design system, DB, current UI state and component inventory (updated 2026-08-01: guest checkout, MercadoPago init_point fix, Zipnova real integration + unified locality autocomplete + weight unit fix, Resend domain blocked)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6d7a1ecb-f10c-42b0-9aad-0eb35639be0a
  modified: 2026-08-02T00:49:14.238Z
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
  attributeValueId String?                              // ← NUEVO — nullable
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
  - Cuotas viven dentro de la columna de precio de lista

### `product-gallery.tsx`

- Flechas prev/next superpuestas en imagen principal (`bg-white/80 backdrop-blur-sm`, centradas verticalmente)
- Loop: `goToIdx()` con módulo envuelto
- Touch swipe: `onTouchStart/onTouchEnd`, umbral 50px
- Oculta flechas si solo hay 1 ítem
- Thumbnails sincronizados con índice activo

### `product-actions.tsx`

- Combo table header: label + subtítulo "Son acumulables con el {CASH_DISCOUNT_PCT}% OFF Efectivo - Transferencia!"
- Botón principal: cuando `disabledReason === 'no-color'` → `inline-flex gap-2` con dos chevron-up SVG flanqueando "Seleccioná una variante"; `disabled:opacity-60`

---

## FAQ (`app/faq/page.tsx`)

Botón Email de la sección de contacto: fixed hover bug (inline `style={{ color }}` sobreescribía `hover:text-white`).
Ahora usa: `border-gray-200 text-gray-600 hover:border-[#0eb1c3] hover:text-[#0eb1c3]`, sin `hover:bg`.

---

## Admin — Productos (`/admin/productos`)

- Query incluye `comboPrices: { orderBy: { quantity: 'asc' } }`
- Tabla: columnas "Precio Pack 1" (idx 0) y "Precio Pack 2" (idx 1)
- `Product` type incluye `comboPrices?: { id: string; price: number; quantity: number }[]`

---

## Checkout — métodos de pago

### `app/checkout/checkout-client.tsx`

- `PaymentMethod = 'mercadopago' | 'cash' | 'transfer' | 'modo'`
- Step 2: **dos radios separados** para cash y transfer (ambos con badge 25% OFF), solo visibles cuando shipping === 'pickup'
- `isCashOrTransfer = payment === 'cash' || payment === 'transfer'`
- Al cambiar a delivery se resetea `cash`/`transfer` → `mercadopago`
- Sidebar muestra descuento 25% cuando `isCashOrTransfer`
- Al confirmar navega a `/checkout/confirmado?method=${payment}` (pasa el método por query param)

### `app/api/checkout/route.ts`

- Branch se dispara con `cash || transfer`, guarda el valor exacto en DB (`paymentMethod`)
- Lookup batch de `attributeValue.value` para nombres de variante antes de armar el email
- Ambos flows (cash/transfer y MP) incluyen `attributeValueId` en `OrderItem.create`
- `status: 'PENDING_PICKUP_PAYMENT'` para cash/transfer; `'PENDING'` para MP

### `app/checkout/confirmado/page.tsx`

Lee `searchParams.method` y muestra contenido distinto:
- `'cash'`: "Efectivo", dirección del local, leyenda Showroom
- `'transfer'`: "Transferencia bancaria", dos tarjetas de cuentas con alias en negrita (MP: **artentino**, Supervielle: **artentinosuper**), link WhatsApp, leyenda Showroom
- `'cash_transfer'` (legacy): texto genérico sin romper pedidos viejos
- Bloque "Descuento aplicado 25% OFF" en los tres casos

---

## CartDrawer

Banner `bg-[#f0fbfc]` con icono shield: "Pagando en efectivo o transferencia, tenés {CASH_DISCOUNT_PCT}% OFF"

---

## CartAddPopup

- Observa `addCount` del cart context, abre popup al incrementar
- Countdown 5 min (300s) `mm:ss`
- Con relacionado: sugerencia + countdown. Sin relacionado: total + "Ver carrito"

---

## Admin — Categorías (`/admin/categorias`) — drag-and-drop entre grupos

`app/admin/categorias/categorias-table.tsx` usa un **único `DndContext` compartido** (id `categorias-dnd`) para reordenar categorías Y subcategorías, discriminado por `data: { type: 'category' | 'subcategory' | 'group-header' | 'group' }` en cada `useSortable`/`useDroppable`, con un `collisionDetection` custom que filtra `droppableContainers` por `type` antes de delegar a `closestCenter`. Permite:
- Reorder de categorías entre sí, y de subcategorías dentro de su propio grupo (`reorderCategories`, `reorderSubcategories`).
- Mover una subcategoría a otro grupo (`moveSubcategory(subcategoryId, newCategoryId, newOrder)` en `actions.ts`) — actualiza `categoryId` y recompacta el `order` en origen y destino en una transacción.
- Auto-expand: si se mantiene una subcategoría sobre el header de un grupo colapsado ~600ms (`AUTO_EXPAND_DELAY`), el grupo se expande solo vía `setOpenExplicit`.
- Estado `openGroups` (expandido/colapsado) vive en `CategoriasTable`, no en `CategoryRow` — necesario para que el drag pueda togglear cualquier grupo.

Este único-`DndContext` es la única forma correcta de resolverlo: anidar un `DndContext` hijo dentro de otro (para separar drag de categorías vs. subcategorías) rompe la resolución de colisiones, porque `useSortable`/`useDroppable` se bindean al contexto más cercano por posición en el árbol de React, no por intención lógica.

---

## Admin — Relacionados

Tab en `/admin/productos/[id]/editar`: search con debounce 350ms, tabla miniatura/nombre/SKU/precio/sortOrder.

---

## Admin — Pedidos

### `app/admin/pedidos/page.tsx` y `[id]/page.tsx`

STATUS dict (ambos archivos):
```typescript
const STATUS = {
  PENDING:                { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  PENDING_PICKUP_PAYMENT: { label: 'A retirar',  bg: '#EDE9FE', color: '#7C3AED' },  // ← badge violeta
  CONFIRMED:              { label: 'Confirmado', bg: '#CCFBF4', color: '#0eb1c3' },
  SHIPPED:                { label: 'Enviado',    bg: '#DBEAFE', color: '#2563EB' },
  DELIVERED:              { label: 'Entregado',  bg: '#D1FAE5', color: '#059669' },
  CANCELLED:              { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
}
```

### Vista detalle `[id]/page.tsx`

- Include de `attributeValue: { select: { value: true } }` en los items
- Formato en cada item: `"{Nombre producto}"` + `"{Color} · x{cantidad}"` en la línea secundaria
- Sidebar tiene tarjeta "Método de pago": muestra "Efectivo" / "Transferencia bancaria" / "MercadoPago"
- Query: `include: { items: { include: { product: {...}, attributeValue: { select: { value: true } } } } }`

---

## Email

`app/lib/email.ts`: `interpolate()`, `appointmentConfirmationEmail`, `pickupCashEmail`, `purchaseConfirmationEmail`.

### `pickupCashEmail`

Parámetros: `{ name, items, total, discountPct, paymentMethod: 'cash' | 'transfer' }`
- `items` incluye `variantName?: string` → se muestra como "Producto · Color" en la tabla
- Sección "Método de pago": "Efectivo — abonás al retirar" vs "Transferencia bancaria — envianos el comprobante"

### `purchaseConfirmationEmail`

Parámetros: `{ name, items, total, shipping }`
- `items` incluye `variantName?: string` → igual formato "Producto · Color"

---

## Microanimaciones

keyframes en `app/globals.css`: `cart-bounce`, `toast-in`, `gallery-fade`, `hero-text-in`, `popup-in`

---

## Assets

- `app/icon.png` — favicon actual (reemplazó `app/favicon.ico`)

---

## WhatsApp

- Botón flotante: `app/ui/whatsapp-button.tsx` → `href="https://wa.me/5491139363333"`
- Footer: `href="https://api.whatsapp.com/send?phone=5491139363333"` (dos instancias)
- Número: +54 9 11 3936 3333

---

---

## Checkout / envíos — estado 2026-08-01 (sesión larga, ver `CONTEXT.md` en la raíz del repo para el detalle completo por commit)

- **Guest checkout**: `/checkout` ya no requiere sesión. `Order.userId` es `String?`; `Order.contactName/contactEmail/contactPhone` son la fuente de verdad (con fallback a `user?.X`) en todo lo que antes asumía `order.user` sin null-check (webhook MP, admin/pedidos, arrepentimiento).
- **MercadoPago**: `MP_ACCESS_TOKEN` es de producción real (cuenta 263472498, verificada). El bug de `init_point` era `result.sandbox_init_point ?? result.init_point` (prioridad invertida) — MP siempre puede devolver `sandbox_init_point` sin importar el tipo de token.
- **Envío a domicilio — arquitectura actual**: un único combo "Localidad" (`app/checkout/checkout-client.tsx`) con autocomplete nacional contra Georef API (`apis.datos.gob.ar/georef/api/localidades`, pública, sin auth, CORS abierto). La provincia se resuelve automáticamente de la respuesta elegida — ya NO hay dropdown cerrado GBA/CABA ni campo de Provincia separado (esa UI existió brevemente y fue reemplazada en la misma sesión). `app/lib/shipping-zones.ts::resolveShippingProvider(locality, province)` decide ARTENTINO (CABA siempre, o localidad normalizada matcheando la lista fija de `/admin/extension`) vs ZIPNOVA.
- **Zipnova**: `app/lib/shipping/zipnova.ts`. La respuesta real de la API tiene `results` como **objeto** indexado por `service_type.code` (no array — la doc induce a error acá). `Product.weight` está en **GRAMOS** en toda la DB (155/155 productos auditados) — nunca convertir a la hora de cotizar.
- **Cotización automática**: se dispara sola (debounce 400ms) al completar Localidad+CP en el paso "Envío" del checkout, ya no hace falta llegar al paso "Pago". Sidebar muestra el estado en tiempo real.
- **Resend bloqueado**: el dominio `artentino.com.ar` no está verificado en Resend → 403 en todos los envíos de mail transaccional. Pendiente de acción manual (DNS) del lado de Valentín, no resoluble por código.

---

**Why:** Complete e-commerce for Argentine home goods brand.
**How to apply:** Peso formatting `toLocaleString('es-AR')`, teal `#0eb1c3` as primary, Prisma 7 + Tailwind v4 + Next.js 16 conventions. Never use `middleware.ts`. Products→Subcategory (not Category) for categoryId. Hero badges→Category padre. Discount constants always from `app/lib/constants.ts`. Never inline `style={{ color }}` on elements that need hover color change — use className instead. PaymentMethod values: `'cash'`, `'transfer'`, `'mercadopago'` (legacy `'cash_transfer'` may exist in old orders). OrderItem.attributeValueId persists the chosen variant — always include it in OrderItem.create from the CartItem. Price numbers in product detail: `font-bold` (700), NOT `font-black`.
