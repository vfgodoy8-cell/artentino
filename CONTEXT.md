# Proyecto Artentino — Contexto actualizado 2026-08-01

E-commerce de decoración, hogar y regalos con diseño argentino.

**Repo:** `C:\proyectos\bardot\artentino\` · Branch: `main`  
**Último commit:** `990ff75` — feat(checkout): integración real de Zipnova para cotización de envíos

---

## Stack

- Next.js 16.2.5 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL en Railway · Prisma (cliente en `app/generated/prisma/`)
- NextAuth (credenciales email/password, bcryptjs)
- MercadoPago (**producción** — `MP_ACCESS_TOKEN` es `APP_USR-` real de la cuenta del cliente, id 263472498, activa/platinum; ver "Cambios recientes" por el bug de `init_point` ya resuelto)
- Zipnova (cotización de envíos a domicilio fuera de zona Express — integración real, API v2, ver "Cambios recientes")
- Cloudinary (imágenes productos, cloud: `dgz7bquai`)
- Resend (emails) — **dominio `artentino.com.ar` sin verificar en Resend** (ver Notas importantes, bloquea todo envío)
- Deploy: Vercel (proyecto `artentino` en team `vfgodoy8-cells-projects`)

---

## Rutas públicas

- `/` — Home: hero, destacados (featured+active, `[sortOrder asc, createdAt desc]`, take:6), promo cards
- `/catalogo` — Listado activos, filtro por categoría
- `/catalogo/[slug]` — Detalle: variantes, combos "comprá más pagá menos", qty selector, carrito
- `/faq` — 5 secciones: envío, pago, registro, regalos corporativos, cambios y devoluciones
- `/checkout`, `/checkout/success|failure|pending` — **no requiere sesión** (guest checkout, ver "Cambios recientes")
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
| `Product` | imageUrl (String?), featured, sortOrder, wholesalePrice, `height/width/length` (Decimal? cm), `weight` (Decimal? **kg** — se convierte a gramos al cotizar con Zipnova) |
| `ProductImage` | tabla `product_images`, url, filename — relación 1:N con Product |
| `Attribute` | `filter` (catálogo público), `hidden` (stock genérico sin variante) |
| `ProductStock` | unique [productId, attributeId, value] |
| `Order` | `userId` **opcional** (`String?`) — invitado si es null. `contactName/contactEmail/contactPhone` siempre poblados desde el form de checkout, son la fuente de verdad para emails/admin cuando no hay `user` |
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

**Resend — dominio sin verificar (bloqueante, pendiente acción manual):**
- `app/lib/email.ts` manda todos los mails con `from: 'Artentino <noreply@artentino.com.ar>'`. Probado con `scripts/test-email.ts` (script de debug, no versionado) contra la `RESEND_API_KEY` real: Resend devuelve 403 `"The artentino.com.ar domain is not verified"`. Quotas en la respuesta: `x-resend-daily-quota: 0` / `x-resend-monthly-quota: 0` — ningún mail transaccional se está entregando (confirmación de compra, turnos, cambio de estado, arrepentimiento, recuperación de contraseña).
- Acción pendiente del lado de Valentín: verificar `artentino.com.ar` en `resend.com/domains` (agregar registros DNS SPF/DKIM que pida el panel).

---

## Cambios recientes (sesión 2026-07-31/08-01)

**1. Fix `init_point` vs `sandbox_init_point` (commit `fa39df7`)**
- `app/api/checkout/route.ts` priorizaba `result.sandbox_init_point ?? result.init_point` — MP siempre puede devolver `sandbox_init_point` en la respuesta de creación de preferencia, sin importar si el token usado es de test o de producción. Con el `MP_ACCESS_TOKEN` real (`APP_USR-...`, cuenta 263472498, verificada vía `/users/me`: `site_status: active`, platinum power-seller, sin restricciones), el checkout igual redirigía a sandbox.
- Fix: invertir la prioridad → `result.init_point ?? result.sandbox_init_point`.

**2. Guest checkout (commit `6b0fb7f`)**
- Antes: `app/checkout/page.tsx` hacía `redirect('/login')` sin sesión, y `app/api/checkout/route.ts` devolvía 401. `proxy.ts` no tenía nada que ver (matcher solo `/admin/*`).
- Schema: `Order.userId` pasó a `String?` (`user User?`), se agregaron `contactName/contactEmail/contactPhone` — pusheado a Railway con `prisma db push --url`.
- Se sacaron ambos guards de sesión. Los dos `prisma.order.create` (cash/transfer y MercadoPago) usan `session?.user?.id ?? null` y siempre graban el contacto del form.
- **Todo lo que leía `order.user.email/name` sin fallback se rompía con invitados** — corregido con `contactX ?? user?.X` en: `app/api/webhook/mercadopago/route.ts` (mail de confirmación de compra), `app/admin/pedidos/page.tsx` + `[id]/page.tsx` (vista admin), `app/admin/pedidos/actions.ts` (mail de cambio de estado), `app/arrepentimiento/actions.ts` (mail de arrepentimiento).
- Gotcha de proceso: el trabajo quedó sin commitear una sesión completa — Vercel siguió sirviendo el código viejo (con el guard de login) hasta que se hizo commit+push explícito. Si algo "no se aplicó" en producción, lo primero a chequear es `git status` / `git log` vs `origin/main`, no asumir bug de código.

**3. Footer de emails: dirección vieja + año hardcodeado (commit `11d6494`)**
- El footer compartido (`FOOTER` en `app/lib/email.ts`) y sus copias en `app/admin/emails/actions.ts` (`EMAIL_DEFAULTS`) y `prisma/seed.ts` (contenido que sembró las filas reales en Railway) tenían `© 2025 Artentino — Colegiales, CABA` — dirección vieja (pre-Fase 1) y año fijo.
- Fix: `FOOTER` → función `emailFooter()` con `new Date().getFullYear()`; dirección corregida a `Av. Corrientes 5022, CABA` en las 3 fuentes.
- **Las filas reales `APPOINTMENT_CONFIRMATION` y `ORDER_PRE_CONFIRMATION` en la DB de Railway se actualizaron a mano** (un `upsert` con `update: {}` en el seed nunca las hubiera tocado) — confirmado footer nuevo (`© 2026 Artentino — Av. Corrientes 5022, CABA`) en ambas.

**4. Integración real de Zipnova (commit `990ff75`)**
- `app/lib/shipping/zipnova.ts` reescrito: `POST https://api.zipnova.com.ar/v2/shipments/quote`, Basic Auth (`ZIPNOVA_KEY:ZIPNOVA_SECRET` en base64), `account_id: 19612` hardcodeado como constante.
- Firma nueva: `getZipnovaQuote({ destinationLocality, isCapital, items: [{weightGrams, heightCm, widthCm, lengthCm, quantity}], declaredValue })`. Lee `data.results` (no `all_results`), toma el de menor `price_incl_tax`.
- Error 400 con mensaje de cuenta inactiva/sin saldo → `{ ok: false, error: 'zipnova_sin_saldo' }` (distinguible; la cuenta no tenía saldo cargado al momento del cambio, esperado ver este error en pruebas).
- Antes cotizaba con un peso fijo de 3kg/30cm — ahora ambos call sites (`app/api/checkout/quote-shipping/route.ts`, usado por el paso "Envío" de la UI, y `app/api/checkout/route.ts`, al crear la Order) hacen join contra `Product` y convierten `weight` (kg) a gramos. `app/checkout/checkout-client.tsx` manda los items del carrito al endpoint de cotización (antes solo mandaba la localidad).
- `.env` local: variables renombradas de `ZIPNOVA_API_KEY`/`ZIPNOVA_ACCOUNT_ID` a `ZIPNOVA_KEY`/`ZIPNOVA_SECRET` (`ZIPNOVA_ACCOUNT_ID` ya no se usa, quedó hardcodeado).
- Redeploy manual forzado sin build cache (`vercel --prod --force`) para que el runtime tomara las env vars nuevas — proyecto Vercel linkeado como `vfgodoy8-cells-projects/artentino`.

---

## Dev

- Puerto local: 3001 (`npm run dev`)
- Admin de prueba: `admin@test.com` / `admin1234` / ADMIN
- DB push: `npx prisma db push --accept-data-loss`
- E2E (`npm run test:e2e`): la DB de test (puerto 5433) corre en un contenedor Docker (`artentino-test-db`, creado ad-hoc esta sesión con `postgres:16-alpine`) — si Docker Desktop no está corriendo o el contenedor no existe, `global-setup.ts` falla en el `db push --force-reset` inicial.
