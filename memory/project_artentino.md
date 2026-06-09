---
name: project-artentino
description: "Contexto completo del proyecto Artentino — stack, estructura, estado actual y pendientes"
metadata:
  node_type: memory
  type: project
  originSessionId: 27bf8e64-7c0e-4ece-a90a-d8b225c6521e
---

# Proyecto Artentino

E-commerce de decoración, hogar y regalos con diseño argentino. Cuotas sin interés, envíos a todo el país.

**Repo:** `C:\proyectos\bardot\artentino\` (repo git anidado dentro de `C:\proyectos\bardot\`)  
**Branch activo:** `main`  
**Último commit:** `734bbf3` — /admin/contactos (2026-06-09)

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

---

## Estructura de rutas

### Públicas
- `/` — Home con hero, destacados (featured+active, orderBy sortOrder), promo cards, marquee
- `/catalogo` — Listado filtrado por `active: true`, pills de categoría
- `/catalogo/[slug]` — Detalle: descripción en caja, precio tachado, chips de variantes, embed YouTube, stock desde stockItems
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
- `/admin/productos` — Lista (sin columna Stock)
- `/admin/productos/nuevo` — Form simplificado: nombre, slug auto, precio, categoría → redirect a editar
- `/admin/productos/[id]/editar` — Tabs: **Información | Stock | Imágenes**
- `/admin/categorias` — CRUD (sin campo Mayorista)
- `/admin/atributos` — CRUD (flag `filter` para catálogo)
- `/admin/destacados` — Gestión de productos destacados
- `/admin/pedidos` — Lista con filtro por estado + detalle con cambio de estado
- `/admin/pedidos/[id]` — Detalle: productos, cliente, envío, StatusSelect (Server Action)
- `/admin/turnos` — Lista con filtro por estado + detalle con cambio de estado
- `/admin/turnos/[id]` — Detalle: fecha/hora, modalidad, cliente, StatusSelect (Server Action)
- `/admin/contactos` — Bandeja filtrada por tipo (General/Trabajo), link mailto para responder
- `/admin/condicion` — **Eliminado** (redirige a /admin)

---

## Modelos Prisma (post refactoring sesión 2026-06-08/09)

| Modelo | Notas |
|---|---|
| `Category` | sortOrder, active (sin wholesaleActive) |
| `Product` | price, comparePrice, cost, **wholesalePrice** (MANTENER), featured, sortOrder (Destacados), dimensiones, videoUrl (sin stock, showPrice, conditionId) |
| `ProductComboPrice` | precios por cantidad con fechas opcionales |
| `Attribute` | flag `filter`, relación `productStocks ProductStock[]` |
| `AttributeValue` | **MANTENER** (sin productStocks) |
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

- `StockItem`: `{ id, stock, attributeId, attribute: {id, name}, value }`
- `addProductStock(productId, attributeId, value)` — atributo existente
- `createAttributeAndStock(productId, attributeName, value)` — crea Attribute + ProductStock

---

## Patrón Server Actions + revalidatePath

Usado en pedidos, turnos (cambio de estado):
```ts
'use server'
await prisma.model.update({ where: { id }, data: { status } })
revalidatePath('/admin/ruta')
revalidatePath(`/admin/ruta/${id}`)
```
Client Component `StatusSelect` usa `useTransition` + el Server Action.

---

## Variables de entorno (.env local)

```
DATABASE_URL        → Railway PostgreSQL
AUTH_SECRET         → NextAuth
MP_ACCESS_TOKEN     → MercadoPago (modo TEST)
NEXT_PUBLIC_BASE_URL → http://localhost:3001
RESEND_API_KEY      → Resend
CLOUDINARY_*        → Cloudinary (cloud, api_key, api_secret)
```

### Usuario de prueba (dev)
- Email: `admin@test.com` / Password: `admin1234` / Role: ADMIN
- Tabla en DB: `users` (minúsculas), tiene campo `name` NOT NULL

---

## Estado actual — TODO pendiente

No quedan pendientes del roadmap original. El backoffice está completo.

### Posibles próximas features
- Filtros por atributos en catálogo público (flag `filter` en Attribute ya listo en DB)
- Notificaciones por email al cambiar estado de pedido/turno (Resend)
- Dashboard con métricas reales (ventas del mes, pedidos recientes)
- Imágenes múltiples en detalle de producto (galería/slider)
