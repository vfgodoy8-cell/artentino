---
name: project-artentino
description: "Artentino e-commerce — tech stack, design system, DB, current UI state and component inventory (updated 2026-07-05)"
metadata: 
  node_type: memory
  type: project
  originSessionId: a248d167-a2e4-47f9-bc66-bf9f4763a938
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

## Schema — categorías (2026-07-05) — DOS NIVELES

La jerarquía anterior (flat Category con `products`) fue reemplazada por un modelo de dos niveles.

```prisma
model Category {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  order         Int           @default(0)
  isSpecial     Boolean       @default(false)  // "Todos", etc.
  subcategories Subcategory[]
  heroBadges    HeroBadge[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  @@map("categories")
}

model Subcategory {
  id         String    @id @default(cuid())
  name       String
  slug       String    @unique
  order      Int       @default(0)
  categoryId String
  category   Category  @relation(fields: [categoryId], references: [id])
  products   Product[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  @@index([categoryId])
  @@map("subcategories")
}
```

**Implicaciones:**
- `Product.categoryId` / `Product.category` → ahora apunta a `Subcategory` (mismo nombre de campo, distinto FK target)
- `HeroBadge.categoryId` / `HeroBadge.category` → apunta a `Category` (padre)
- Filtros en catálogo: `category: { category: { slug } }` para padre; `category: { slug }` para subcategoría
- Breadcrumb producto: Inicio / Catálogo / **ParentName** / **SubcatName** / ProductName
- Scripts admin usan `prisma.subcategory` para los selects de categoría en productos

**Migración:** `prisma/migrate-categories.ts` — script raw SQL con `pg.Pool` que:
1. Suelta FKs viejas, limpia datos, adapta tabla `categories`
2. Crea tabla `subcategories`
3. Inserta padres, inserta subcategorías (old categories) bajo sus padres correspondientes
4. Reasigna `products.categoryId` → nuevos IDs de subcategorías
5. Recrea FKs y hero_badges

**Categorías padre en producción:**
Espejos (1), Iluminación (2), Lámparas (3), Muebles (4), Mamparas (5), Cuellos (6), Bazar (7), Bultos Oferta (8), Outlet (9), Todos (10, isSpecial=true)

---

## Schema — otros modelos relevantes

### ProductImage — N-to-N con AttributeValue (desde 2026-06-19)

`ProductImage.attributeValueId` dropeado. Relación join N-a-N:
```prisma
model ProductImageAttributeValue {
  imageId          String
  image            ProductImage   @relation(...)
  attributeValueId String
  attributeValue   AttributeValue @relation(...)
  @@unique([imageId, attributeValueId])
  @@map("product_image_attribute_values")
}
```
Índice parcial (SQL crudo): `CREATE UNIQUE INDEX product_images_one_cover_per_product ON product_images ("productId") WHERE "isCover" = true`

### SiteConfig — singleton (actualizado 2026-07-05)
```prisma
model SiteConfig {
  id                  String  @id @default("singleton")
  heroIntervalSeconds Int     @default(6)
  footerText          String? @db.Text   // texto bajo el logo en el footer
  @@map("site_config")
}
```

### HeroSlide / HeroBadge / EmailTemplate
Ver CLAUDE.md para detalles completos. HeroBadge.categoryId → Category padre (no Subcategory).

### Otros campos Product
- `Product.imageUrl String?` — caché denormalizado de la portada (`isCover=true`)
- `ProductStock.sortOrder Int @default(0)` — orden en selector y tabla admin
- `Attribute.imageDriven Boolean` — controla image swap en galería

---

## UI State — Catálogo (updated 2026-07-05)

### Catalog page (`app/catalogo/page.tsx`) — RSC

**Layout actual:**
```
[Header atmosférico full-width 180px]
[max-w-7xl px-4 py-8]
  [flex gap-10]
    [aside w-52 — CategorySidebar (solo lg+)]
    [div flex-1]
      [CategoryPills — solo mobile < lg]
      [grid products]
```

**Filtrado:**
- Detecta si `categoria` slug es padre (`prisma.category.findUnique`) o subcategoría
- Padre: `{ category: { category: { slug: categoria } } }` — filtra todos los productos de ese grupo
- Subcategoría: `{ category: { slug: categoria } }` — filtra exacto
- Sin filtro o "todos": ordena `[{ name: 'asc' }]`; con filtro: `[{ sortOrder: 'asc' }, { createdAt: 'desc' }]`
- Heading: nombre del padre o nombre de la subcategoría del primer producto

**Categorías para sidebar/pills:** `prisma.category.findMany({ where: { isSpecial: false }, select: { id, name, slug, subcategories: { select: { id, name, slug } } } })`

### CategorySidebar (`app/catalogo/category-sidebar.tsx`) — Client Component, desktop only

- Sticky `top-8`, max-height con overflow-y-auto (scrollbar oculto)
- "Todos" link primero, luego grupos padre
- Cada padre: Link body + botón caret `›` (SVG) que abre/cierra subcategorías inline
- Subcategorías: indentadas con `border-l-2 border-[#f3f4f6] pl-3`
- Auto-abre grupo si `activeSlug` coincide con el padre o alguna subcategoría (`useEffect([activeSlug])`)
- Active: texto teal para grupos, `bg-[#e0f8fb] text-[#0eb1c3]` para subcategorías, `bg-[#0eb1c3] text-white` para "Todos"

### CategoryPills (`app/catalogo/category-pills.tsx`) — Client Component, mobile only (< lg)

- Scroll horizontal con fades y flechas ‹ ›
- Cada padre: pill split (body navega, caret `›` expande subcategorías inline como fila debajo)
- Auto-abre grupo si `activeSlug` pertenece a subcategoría del grupo

---

## UI State — Detalle de producto (updated 2026-07-05)

### `app/catalogo/[slug]/page.tsx` — RSC

- Query: `include: { category: { include: { category: true } } }` (Subcategory + parent Category)
- Breadcrumb: 5 niveles — Inicio / Catálogo / ParentCategory / Subcategory / Producto
- Pasa `youtubeId` al shell (ya no hay bloque de video separado en la página)

### `product-detail-shell.tsx` — Client Component (2026-07-05)

Props adicionales vs versión anterior: `youtubeId: string | null`

**Layout:**
```
[grid lg:grid-cols-2]
  [ProductGallery — izquierda]
  [div flex-col — derecha]
    [badge categoría]
    [h1 nombre]
    [precio + cuotas]
    [ProductActions — combos + qty + VariantSelector + botón carrito]
    [divider]
    [stock indicator]
    [← Volver al catálogo]
[div mt-12 grid md:grid-cols-2 — FULL WIDTH]
  [Descripción]
  [Información adicional]
```

La descripción e información adicional están **fuera de la columna derecha**, en un bloque full-width de dos columnas debajo del grid principal.

**onClearColor:** limpia `selectedColorId` + incrementa `colorResetKey` → re-monta ProductGallery (reset visual) + re-monta VariantSelector via `key={colorResetKey}` en ProductActions

### `product-gallery.tsx` — Client Component (2026-07-05)

Props: `galleryImages`, `productName`, `categoryName`, `selectedColorId: string | null`, `youtubeId: string | null`  
**Removido:** `variantGroups`, `stockByValueId`, `onColorSelect` (VariantSelector ya no vive aquí)

- `imageDrivenId`: usa `selectedColorId` directamente (ya no local `selectedIds`)
- `useEffect([selectedColorId])` → resetea `preferredUrl` y `isVideoActive` al cambiar color
- **Video integrado:** thumbnail negro con ▶ al final de la fila; al clickear → `isVideoActive=true` → iframe con `autoplay=1` en main area; borde teal cuando activo

### `product-actions.tsx` — Client Component (2026-07-05)

Props adicionales: `variantGroups`, `stockByValueId`, `onColorSelect`, `colorResetKey`

**Orden de elementos:**
1. Combo table (con tooltip de transferencia on hover)
2. Selector de cantidad
3. VariantSelector (`key={colorResetKey}` para reset visual al limpiar color)
4. Botón "Agregar al carrito"

**Cambios de texto:**
- Título combos: `"Comprá más y sumá descuentos adicionales"` (antes: "Comprá más, pagá menos")
- Botón disabled con no-color: `"Seleccioná una variante"` (antes: "Seleccioná un color")
- Label de sección sobre VariantSelector: `"Variante"`
- Stock indicator: `"Elegí una variante para ver el stock disponible"`

**Tooltip transferencia:**
- Wrapper externo `relative` con `onMouseEnter/Leave` → `showTooltip` state
- Tooltip: `absolute -top-11 left-1/2 -translate-x-1/2 bg-[#1E1E1E] text-white`
- Texto: "Si comprás con transferencia, tenés un 15% de descuento"
- Diamante inferior: `div h-3 w-3 rotate-45 bg-[#1E1E1E] -bottom-1.5`
- El `overflow-hidden` está en el div hijo (combo box), no en el wrapper, para no clipear el tooltip

---

## Footer (updated 2026-07-05)

`app/ui/footer.tsx` — ahora **async RSC** (fetches siteConfig):

- **Fondo:** `#F0FBFC` (teal muy claro, antes `#1E1E1E` oscuro)
- **Texto principal:** `#374151` / `#4b5563` (antes `#555` / `#888`)
- **Texto muted:** `#9ca3af` (antes `#444`)
- **Iconos sociales:** `border-[#b3e8ee] text-[#6b7280]`, hover: `#0eb1c3`
- **Border bottom bar:** `#c8eff4`
- **footerText:** leído de `siteConfig?.footerText ?? DEFAULT_TEXT`; editable desde `/admin/home`

**Admin:** sección "Pie de página" en `/admin/home` (abajo de HeroBadgesTab) — `FooterTextSection` Client Component con textarea + "Guardar" + "Restaurar default". Action: `updateSiteConfig({ footerText })`.

---

## Product Card badge (2026-07-05)

`app/ui/product-card.tsx` línea 49 — badge de categoría top-left:
```tsx
<span className="... bg-[#0eb1c3]/30 ...">
```
Opacidad: 30% (antes 90%). El color de imagen es visible a través del badge.

---

## Admin — Categorías (`app/admin/categorias/`) (2026-07-05)

- `page.tsx`: RSC — `prisma.category.findMany({ select: { id, name, slug, order, isSpecial, subcategories: { select: ... } } })`
- `categorias-table.tsx`: Client — acordeón de grupos padre con `CategoryRow` (collapsible) + `SubcatRow` (editar/borrar subcategorías) + `AddSubcatRow` + `AddCategoryRow`
- `actions.ts`: `createCategory/updateCategory/deleteCategory` (padre) + `createSubcategory/updateSubcategory/deleteSubcategory` (hijo); todos revalidan `/admin/categorias`, `/`, `/catalogo`
- No hay toggle `active` — el nuevo schema no tiene ese campo en Category ni Subcategory

---

## Hero carousel y email templates

Sin cambios vs. sesión anterior (2026-07-02). Ver CLAUDE.md para detalles.

**`updateSiteConfig` signature actualizada (2026-07-05):**
```typescript
export async function updateSiteConfig(data: { heroIntervalSeconds?: number; footerText?: string })
```
El llamado en `hero-slides-tab.tsx` usa `updateSiteConfig({ heroIntervalSeconds: interval })`.

---

## Test seed (`prisma/seed-test.ts`) — updated 2026-07-05

Ahora crea dos niveles de categorías:
```typescript
const parentEspejos = await prisma.category.create({ data: { name: 'Espejos', slug: 'espejos', order: 1 } })
const parentLamparas = await prisma.category.create({ data: { name: 'Lámparas', slug: 'lamparas', order: 2 } })
const catEspejos = await prisma.subcategory.create({ data: { name: 'Espejos LED', slug: 'espejos-led', order: 1, categoryId: parentEspejos.id } })
const catLamparas = await prisma.subcategory.create({ data: { name: 'Lámparas de Mesa', slug: 'lamparas-de-mesa', order: 1, categoryId: parentLamparas.id } })
```
Productos apuntan a subcategorías (no categorías padre).

---

## Pages/features built

- Full product catalog — CategorySidebar (desktop) + CategoryPills (mobile) con jerarquía padre/hijo
- Product detail: galería integrada con video (YouTube thumbnail), VariantSelector entre qty y carrito, descripción full-width, tooltip de transferencia en combos
- Shopping cart (localStorage) con CartDrawer
- Checkout multi-step con MercadoPago
- Admin: producto (3 tabs Info/Stock/Imágenes con drag & drop)
- Admin: categorías — acordeón de dos niveles (padre + subcategorías)
- Admin: Hero/Home — slides + badges + intervalo + footer text (`/admin/home`)
- Admin: Templates de email (`/admin/emails`)
- Auth, Turnos, FAQ, Contacto (solo formulario general)
- Footer: fondo claro `#F0FBFC`, footerText editable desde admin

**Why:** Complete e-commerce for Argentine home goods brand.
**How to apply:** Peso formatting `toLocaleString('es-AR')`, teal `#0eb1c3` as primary, Prisma 7 + Tailwind v4 + Next.js 16 conventions. Never use `middleware.ts`. Products→Subcategory (not Category) for categoryId. Hero badges→Category padre.
