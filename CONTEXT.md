# Proyecto Artentino — Contexto actualizado 2026-06-10

E-commerce de decoración, hogar y regalos con diseño argentino.

**Repo:** `C:\proyectos\bardot\artentino\` · Branch: `main`  
**Último commit:** `9c6ea6b` — Fix destacados: revalidar home + desempate sortOrder

---

## Stack

- Next.js 16.2.5 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL en Railway · Prisma (cliente en `app/generated/prisma/`)
- NextAuth (credenciales email/password, bcryptjs)
- MercadoPago (modo TEST)
- Cloudinary (imágenes productos, cloud: `dgz7bquai`)
- Resend (emails)
- Deploy: Vercel

---

## Rutas públicas

- `/` — Home: hero, destacados (featured+active, `[sortOrder asc, createdAt desc]`, take:6), promo cards
- `/catalogo` — Listado activos, filtro por categoría
- `/catalogo/[slug]` — Detalle: variantes, combos "comprá más pagá menos", qty selector, carrito
- `/faq` — 5 secciones: envío, pago, registro, regalos corporativos, cambios y devoluciones
- `/checkout`, `/checkout/success|failure|pending`
- `/turnos`, `/contacto`, `/login`, `/registro`, `/recuperar-contrasena`
- `/perfil`, `/perfil/pedidos`, `/perfil/pedidos/[id]`

## Rutas admin

- `/admin` — Dashboard
- `/admin/productos` — Lista paginada, filtro activos/inactivos
- `/admin/productos/nuevo` — Form básico → redirect a editar
- `/admin/productos/[id]/editar` — Tabs: Información | Stock | Imágenes
- `/admin/categorias`, `/admin/atributos` (flags filter/hidden, buscador)
- `/admin/destacados` — Agregar/quitar/reordenar
- `/admin/pedidos`, `/admin/pedidos/[id]`
- `/admin/turnos`, `/admin/turnos/[id]`
- `/admin/contactos` — Bandeja por tipo, mailto

---

## Modelos Prisma clave

| Modelo | Notas |
|---|---|
| `Product` | imageUrl (String?), featured, sortOrder, wholesalePrice |
| `ProductImage` | tabla `product_images`, url, filename — relación 1:N con Product |
| `Attribute` | `filter` (catálogo público), `hidden` (stock genérico sin variante) |
| `ProductStock` | unique [productId, attributeId, value] |
| `Condition` | **ELIMINADO** |

---

## Notas importantes

**Imágenes:**
- `product.imageUrl` es la imagen principal (thumbnails admin, cards catálogo).
- Upload route `/api/admin/upload` → Cloudinary → crea `ProductImage` → sincroniza `imageUrl` si null.
- Backfill aplicado 2026-06-10: los 2 productos con fotos ya tienen `imageUrl` poblado.
- 5 productos demo sin imágenes subidas → fallback correcto.
- `product-card.tsx` usa `<img>` nativo; admin usa `<Image>` (remotePatterns: `res.cloudinary.com`).

**Destacados / revalidación:**
- `addDestacado` y `removeDestacado` llaman `revalidatePath('/')` + `revalidatePath('/admin/destacados')`.
- Toda acción que cambie datos visibles en el home DEBE revalidar `/`.

**Prisma en scripts Node:**
- El cliente generado es TypeScript puro, no importable con `require`. Para queries de diagnóstico usar `pg` directo con `DATABASE_URL`.

**Stock sin variante:**
- `upsertGenericStock(productId, qty)` crea automáticamente un `Attribute` con `hidden:true` llamado "Genérico".

---

## Dev

- Puerto local: 3001 (`npm run dev`)
- Admin de prueba: `admin@test.com` / `admin1234` / ADMIN
- DB push: `npx prisma db push --accept-data-loss`
