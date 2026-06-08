# Proyecto Artentino — Contexto

E-commerce de decoración, hogar y regalos con diseño argentino. Cuotas sin interés, envíos a todo el país.

**Repo:** `C:\proyectos\bardot\artentino\`  
**Branch activo:** `main`  
**Último commit:** `a9faf36` — "logo real Artentino integrado en header, footer y admin" (22 mayo 2026)

---

## Stack

- **Framework:** Next.js 16.2.5 (App Router) + React 19 + TypeScript
- **Estilos:** Tailwind CSS 4
- **DB:** PostgreSQL en Railway vía Prisma (cliente generado en `app/generated/prisma/`)
- **Auth:** NextAuth con credenciales (email/password, bcrypt)
- **Pagos:** MercadoPago (modo TEST activo)
- **Imágenes:** Cloudinary para subida de imágenes de productos
- **Email:** Resend para confirmaciones y contacto
- **Deploy:** Vercel (con `prisma generate` en build)

---

## Estructura de rutas

### Públicas
- `/` — Home con hero, productos destacados, promo cards, marquee
- `/catalogo` — Listado de productos con barra de categorías
- `/catalogo/[slug]` — Detalle de producto
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
- `/admin/productos` — Lista + búsqueda
- `/admin/productos/nuevo` — Formulario con tabs
- `/admin/productos/[id]/editar` — Tabs: info, atributos, stock, imágenes
- `/admin/categorias` — CRUD
- `/admin/atributos` — CRUD (con flag `filter` para catálogo)
- `/admin/condicion` — CRUD (badges de estado del producto)
- `/admin/destacados` — Gestión de productos destacados

### Admin — SIN IMPLEMENTAR (aparecen en sidebar)
- `/admin/pedidos` — **FALTA** lista + cambio de estado
- `/admin/turnos` — **FALTA** lista + confirmar/cancelar turno
- `/admin/contactos` — **FALTA** (modelo Contact existe en DB)

---

## Modelos Prisma (`prisma/schema.prisma`)

| Modelo | Notas |
|---|---|
| `Category` | `wholesaleActive`, `sortOrder`, `active` |
| `Product` | precio, comparePrice, cost, wholesalePrice, stock, featured, showPrice, dimensiones, videoUrl |
| `ProductComboPrice` | precios por cantidad con fechas opcionales |
| `Attribute` + `AttributeValue` | atributos con flag `filter` para filtrado en catálogo |
| `ProductAttribute` | relación producto-atributo |
| `ProductStock` | stock por variante (attributeValue) |
| `ProductImage` | imágenes extra via Cloudinary |
| `User` | roles: USER / ADMIN |
| `Order` + `OrderItem` | estados: PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED |
| `Appointment` | turnos: PRESENCIAL/WHATSAPP, estados: PENDING/CONFIRMED/CANCELLED |
| `Contact` | tipos: GENERAL/JOB |
| `Condition` | badges visuales con colorClass |

---

## Componentes UI clave

- `app/ui/header.tsx` — logo `/logo.png`, nav desktop, dropdown usuario, carrito
- `app/ui/footer.tsx` — logo, links, redes
- `app/ui/cart-drawer.tsx` — carrito lateral
- `app/ui/product-card.tsx` — tarjeta de producto
- `app/ui/whatsapp-button.tsx` — botón flotante
- `app/context/cart-context.tsx` — estado global del carrito
- `app/providers.tsx` — SessionProvider de NextAuth
- `app/admin/sidebar-nav.tsx` — sidebar colapsable con grupos

---

## Variables de entorno (.env local)

```
DATABASE_URL         → Railway PostgreSQL
AUTH_SECRET          → NextAuth
MP_ACCESS_TOKEN      → MercadoPago (modo TEST)
NEXT_PUBLIC_BASE_URL → http://localhost:3001
RESEND_API_KEY       → Resend
CLOUDINARY_*         → Cloudinary (cloud, api_key, api_secret)
```

---

## Pendientes priorizados

### Alta (funcional para operar el negocio)
1. **`/admin/pedidos`** — lista, filtro por estado, cambio de estado, detalle
2. **`/admin/turnos`** — lista, confirmar/cancelar, vista por fecha

### Media
3. **`/admin/contactos`** — ver mensajes recibidos
4. **Filtros por atributos en catálogo** — el flag `filter` en `Attribute` ya está listo en DB

### "Pronto" (sidebar placeholders)
5. **Marcas** — requiere nuevo modelo en Prisma
6. **Import / Export** de productos (CSV)

### Grupos vacíos en sidebar
7. **Extensión**, **Marketing** (banners, cupones), **Sistema** (config de tienda)
