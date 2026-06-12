---
name: project-artentino
description: "Contexto completo del proyecto Artentino — stack, estructura, estado actual y pendientes"
metadata:
  type: project
---

# Proyecto Artentino

E-commerce de decoración, hogar y regalos con diseño argentino. Cuotas sin interés, envíos a todo el país.

**Repo:** `C:\proyectos\bardot\artentino\` (repo git anidado dentro de `C:\proyectos\bardot\`)  
**Branch activo:** `main`  
**Último commit:** `9c6ea6b` — Fix destacados: revalidar home + desempate sortOrder (2026-06-10)

**Why:** Proyecto de aprendizaje semanal que va creciendo feature por feature.  
**How to apply:** Respetar la estructura y convenciones ya establecidas al agregar features nuevas.

---

## Stack

- **Framework:** Next.js 16.2.5 (App Router) + React 19 + TypeScript
- **Estilos:** Tailwind CSS 4
- **DB:** PostgreSQL en Railway vía Prisma (cliente generado en `app/generated/prisma/`)
- **Auth:** NextAuth con credenciales (email/password, bcryptjs)
- **Pagos:** MercadoPago (modo TEST activo)
- **Imágenes:** Cloudinary para subida de imágenes de productos
- **Email:** Resend para confirmaciones y contacto
- **Deploy:** Vercel (con `prisma generate` en build)

### Importante sobre Prisma
- Cliente generado en `app/generated/prisma/` (output custom, NO en `node_modules/.prisma`)
- Schema push: `npx prisma db push --accept-data-loss`
- Decimal fields (price, comparePrice, cost) deben pasarse por `Number()` antes de enviar a Client Components
- El cliente TypeScript NO se puede importar en scripts Node crudos (`require`/`.js`) — usar `pg` directo para queries de diagnóstico

---

## Estructura de rutas

### Públicas
- `/` — Home con hero, destacados (featured+active, orderBy `[sortOrder asc, createdAt desc]`, take:6), promo cards, marquee
- `/catalogo` — Listado filtrado por `active: true`, pills de categoría
- `/catalogo/[slug]` — Detalle: descripción en caja, precio tachado, chips de variantes, selector de color/talle, combos "Comprá más pagá menos", embed YouTube
- `/faq` — Preguntas frecuentes con 5 secciones ancladas (envío, pago, registro, regalos, cambios)
- `/checkout` — Carrito + MercadoPago
- `/checkout/success|failure|pending` — Resultados del pago
- `/turnos` — Formulario de turnos (presencial/WhatsApp)
- `/contacto` — Formulario de contacto (tipo: general/trabajo)
- `/login`, `/registro`, `/recuperar-contrasena`
- `/perfil` — Datos del usuario (protegida)
- `/perfil/pedidos` — Historial de pedidos
- `/perfil/pedidos/[id]` — Detalle de pedido

### Admin (protegidas, rol ADMIN)
- `/admin` — Dashboard con métricas
- `/admin/productos` — Lista paginada (sin columna Stock), filtro activos/inactivos
- `/admin/productos/nuevo` — Form simplificado: nombre, slug auto, precio, categoría → redirect a editar
- `/admin/productos/[id]/editar` — Tabs: **Información | Stock | Imágenes**
- `/admin/categorias` — CRUD (sin campo Mayorista)
- `/admin/atributos` — CRUD (flags `filter` y `hidden`), buscador por nombre
- `/admin/destacados` — Gestión de productos destacados (buscar, agregar, quitar, reordenar)
- `/admin/pedidos` — Lista con filtro por estado + detalle con cambio de estado
- `/admin/pedidos/[id]` — Detalle: productos, cliente, envío, StatusSelect (Server Action)
- `/admin/turnos` — Lista con filtro por estado + detalle con cambio de estado
- `/admin/turnos/[id]` — Detalle: fecha/hora, modalidad, cliente, StatusSelect (Server Action)
- `/admin/contactos` — Bandeja filtrada por tipo (General/Trabajo), link mailto para responder
- `/admin/condicion` — **Eliminado** (redirige a /admin)

---

## Modelos Prisma

| Modelo | Notas |
|---|---|
| `Category` | sortOrder, active (sin wholesaleActive) |
| `Product` | price, comparePrice, cost, **wholesalePrice** (MANTENER), featured, sortOrder, dimensiones, videoUrl (sin stock, showPrice, conditionId) |
| `ProductComboPrice` | precios por cantidad con fechas opcionales |
| `Attribute` | flag `filter` (catálogo público), flag **`hidden`** (oculta de UI pública, usado para stock genérico sin variante) |
| `AttributeValue` | **MANTENER** |
| `ProductAttribute` | relación producto-atributo |
| `ProductStock` | `attributeId + value string`, unique `[productId, attributeId, value]` |
| `ProductImage` | imágenes extra via Cloudinary |
| `User` | roles: USER / ADMIN |
| `Order` + `OrderItem` | estados: PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED |
| `Appointment` | turnos: PRESENCIAL/WHATSAPP, estados: PENDING/CONFIRMED/CANCELLED |
| `Contact` | tipos: GENERAL/JOB |
| **`Condition`** | **ELIMINADO** |

---

## Tab Stock (editar producto)

- `StockItem`: `{ id, stock, attributeId, attribute: {id, name, hidden}, value }`
- `addProductStock(productId, attributeId, value)` — atributo existente
- `createAttributeAndStock(productId, attributeName, value)` — crea Attribute + ProductStock
- `upsertGenericStock(productId, qty)` — crea atributo hidden "Genérico" automático para productos sin variantes
- Variantes hidden se filtran de la tabla pública (`visibleItems = items.filter(i => !i.attribute.hidden)`)

---

## Imágenes de producto

- Campo `product.imageUrl` (String?) es la imagen principal — usada en thumbnails de admin y cards de catálogo.
- Tabla `product_images` guarda todas las imágenes subidas (relación 1:N, modelo `ProductImage`).
- Upload route (`/api/admin/upload`): sube a Cloudinary → crea `ProductImage` → setea `product.imageUrl` si era null.
- **Backfill aplicado 2026-06-10:** `UPDATE products SET imageUrl = (primer url de product_images)` para productos que tenían imágenes subidas antes del fix.
- Los 5 productos demo (Espejo LED, Lámpara, Sillón, Taza, Kit Mate) no tienen imágenes subidas → muestran fallback correctamente.
- `product-card.tsx` usa `<img>` nativo (no `next/image`) → remotePatterns no aplica en catálogo.
- Admin usa `<Image>` de next/image → `res.cloudinary.com` está en `remotePatterns` en `next.config.ts`.

---

## Patrón Server Actions + revalidatePath

```ts
'use server'
await prisma.model.update({ where: { id }, data: { status } })
revalidatePath('/admin/ruta')
revalidatePath(`/admin/ruta/${id}`)
```
Client Component `StatusSelect` usa `useTransition` + el Server Action.

**Importante:** acciones que afectan el home (ej. destacados) deben llamar también `revalidatePath('/')`.

---

## Variables de entorno (.env local)

```
DATABASE_URL        → Railway PostgreSQL (turntable.proxy.rlwy.net:40625/railway)
AUTH_SECRET         → NextAuth
MP_ACCESS_TOKEN     → MercadoPago (modo TEST)
NEXT_PUBLIC_BASE_URL → http://localhost:3001
RESEND_API_KEY      → Resend
CLOUDINARY_*        → Cloudinary (cloud_name: dgz7bquai)
```

### Usuario de prueba (dev)
- Email: `admin@test.com` / Password: `admin1234` / Role: ADMIN
- Tabla en DB: `users` (minúsculas), tiene campo `name` NOT NULL

---

## Estado actual

El backoffice está completo. No quedan pendientes del roadmap original.

### Posibles próximas features
- Filtros por atributos en catálogo público (flag `filter` en Attribute ya listo en DB)
- Notificaciones por email al cambiar estado de pedido/turno (Resend)
- Dashboard con métricas reales (ventas del mes, pedidos recientes)
- Imágenes múltiples en detalle de producto (galería/slider)
- Subir imágenes a los 5 productos demo que actualmente muestran fallback
