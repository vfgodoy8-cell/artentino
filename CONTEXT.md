# Proyecto Artentino — Contexto actualizado 2026-08-07

E-commerce de decoración, hogar y regalos con diseño argentino.

**Repo:** `C:\proyectos\bardot\artentino\` · Branch: `main`  
**Último commit:** `2c9431a` — fix(email): unificar dirección de contacto a info@artentino.com (sin .ar)

**Dominio propio ya en producción:** `artentino.com.ar` (cutover de DNS hecho — antes solo existía `artentino.vercel.app`). `NEXT_PUBLIC_BASE_URL` en Vercel Production apunta a `https://artentino.com.ar` (variable "Sensitive", confirmado indirectamente vía `og:image` del HTML servido, no legible con `vercel env pull`).

---

## Stack

- Next.js 16.2.5 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- PostgreSQL en Railway · Prisma (cliente en `app/generated/prisma/`)
- NextAuth v5 beta (credenciales email/password, bcryptjs) — **login usa `signIn()` client-side** (`next-auth/react`), no server-side (ver "Cambios recientes", bug de header desactualizado tras loguearse)
- MercadoPago (**producción** — `MP_ACCESS_TOKEN` es `APP_USR-` real de la cuenta del cliente, id 263472498, activa/platinum; ver "Cambios recientes" por el bug de `init_point` ya resuelto)
- Zipnova — cotización **y creación real de envíos**, API v2 (ver "Cambios recientes" — antes solo cotizaba, ahora también dispara la creación del envío al confirmarse el pago)
- Cloudinary (imágenes productos, cloud: `dgz7bquai`)
- Resend (emails) — remitente `noreply@artentino.com.ar`, copia de admin a `info@artentino.com` (**sin** `.ar` — ver "Cambios recientes", dominios de contacto distintos, no confundir). **Estado de verificación del dominio en Resend no reconfirmado en esta sesión** — la sesión previa (2026-08-01) lo encontró bloqueado (403, dominio no verificado); no se re-testeó explícitamente acá, sendEmail() falla en silencio (`.catch(() => {})`) así que un 403 no se notaría solo. Verificar antes de asumir que los mails salen.
- Instagram Graph API — flujo nuevo "Instagram API con inicio de sesión de Instagram" (tokens `IGAA...`), no el viejo Facebook Login (ver "Cambios recientes")
- Deploy: Vercel (proyecto `artentino` en team `vfgodoy8-cells-projects`)

---

## Rutas públicas

- `/` — Home: hero, destacados (featured+active, `[sortOrder asc, createdAt desc]`, take:6), promo cards
- `/catalogo` — Listado activos, filtro por categoría
- `/catalogo/[slug]` — Detalle: variantes, combos "comprá más pagá menos", qty selector, carrito
- `/faq` — 5 secciones: envío, pago, registro, regalos corporativos, cambios y devoluciones
- `/checkout`, `/checkout/success|failure|pending` — **no requiere sesión** (guest checkout, ver "Cambios recientes"). Envío a domicilio usa un único combo de Localidad (autocomplete Georef, búsqueda nacional) — ya no hay dropdown cerrado GBA/CABA ni campo de Provincia separado
- `/turnos`, `/contacto`, `/login`, `/registro`, `/recuperar-contrasena`
- `/perfil`, `/perfil/pedidos`, `/perfil/pedidos/[id]`

## Rutas admin

- `/admin` — Dashboard
- `/admin/productos` — Lista paginada, filtro activos/inactivos
- `/admin/productos/nuevo` — Form básico → redirect a editar
- `/admin/productos/[id]/editar` — Tabs: Información | Stock | Imágenes
- `/admin/categorias`, `/admin/atributos` (flags filter/hidden, buscador)
- `/admin/destacados` — Agregar/quitar/reordenar
- `/admin/pedidos`, `/admin/pedidos/[id]` — detalle incluye bloque "Envío Zipnova" (shipmentId/estado/descargar etiqueta) cuando `shippingProvider === 'ZIPNOVA'`
- `/admin/turnos`, `/admin/turnos/[id]`
- `/admin/contactos` — Bandeja por tipo, mailto
- `/admin/home` — Hero slides + badges + intervalo del carousel
- `/admin/emails` — Editor de `EmailTemplate` (variables clic-to-insert, preview con iframe)
- `/admin/instagram` — Pegar/renovar access token del feed (ver "Cambios recientes")
- `/admin/extension` — Localidades Express + toggles de shipping
- `/admin/administradores` — Solo `SUPERADMIN`: alta/gestión de otros admins (`AdminRole`)
- `/admin/auditoria` — Solo `SUPERADMIN`: log de acciones (`logAudit`)

---

## Modelos Prisma clave

| Modelo | Notas |
|---|---|
| `Product` | imageUrl (String?), featured, sortOrder, wholesalePrice, `height/width/length` (Decimal? cm), `weight` (Decimal? **gramos** — TODO el catálogo, 155/155 auditados, confirmado consistente; NUNCA convertir al cotizar con Zipnova, ver "Cambios recientes" — el bug real fue justamente una conversión de más) |
| `ProductImage` | tabla `product_images`, url, filename — relación 1:N con Product |
| `Attribute` | `filter` (catálogo público), `hidden` (stock genérico sin variante) |
| `ProductStock` | unique [productId, attributeId, value] |
| `Order` | `userId` **opcional** (`String?`) — invitado si es null. `contactName/contactEmail/contactPhone` siempre poblados desde el form de checkout, son la fuente de verdad para emails/admin cuando no hay `user`. **Nuevo:** `contactDocument` (DNI, requerido para Zipnova), `zipnovaShipmentId`/`zipnovaServiceTypeCode`/`zipnovaShipmentStatus`/`zipnovaShipmentCreatedAt`/`zipnovaShipmentError` (ver "Cambios recientes") |
| `InstagramToken` | Singleton (un solo row). `accessToken`, `igUserId`, `expiresAt`, `reminderSentAt` (`DateTime?`, se resetea a `null` en cada guardado de token — nuevo o refresh — para reiniciar el ciclo de aviso de vencimiento), `updatedAt` |
| `Role` (enum) | `USER` \| `ADMIN` — separado de `AdminRole` (enum) `SUPERADMIN` \| `ADMIN`, este último solo relevante dentro del panel (`User.adminRole`, opcional) |
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

**Resend — dominio sin verificar (bloqueante, pendiente acción manual — estado sin reconfirmar desde 2026-08-01):**
- `app/lib/email.ts` manda todos los mails con `from: 'Artentino <noreply@artentino.com.ar>'`. Al 2026-08-01, probado con `scripts/test-email.ts` (script de debug, no versionado) contra la `RESEND_API_KEY` real: Resend devolvía 403 `"The artentino.com.ar domain is not verified"`. Quotas en la respuesta: `x-resend-daily-quota: 0` / `x-resend-monthly-quota: 0`.
- **No se volvió a testear explícitamente en la sesión del 08-07** pese a agregar dos features nuevas de mail (copia de compra a `info@`, aviso de vencimiento de Instagram) — como `sendEmail()` siempre se llama con `.catch(() => {})` (fire-and-forget), un 403 no genera ningún error visible. Antes de confiar en que estos mails salen, verificar de nuevo.
- Acción pendiente del lado de Valentín: verificar `artentino.com.ar` en `resend.com/domains` (agregar registros DNS SPF/DKIM que pida el panel).

**`CRON_SECRET` no existe en Vercel Production (bloqueante, encontrado 2026-08-05, sin resolver):**
- `vercel env ls production` no lista `CRON_SECRET` — solo existe en `.env` local (`dev-test-secret-12345`, un placeholder de dev). El cron diario de Instagram (`app/api/cron/instagram-refresh/route.ts`, corre 06:00 UTC) empieza con `if (!process.env.CRON_SECRET || authHeader !== ...) return 401` — si la env var no existe en Production, **la ruta rechaza con 401 a cualquiera, incluido el propio cron de Vercel**, por lo que probablemente nunca corrió exitosamente en producción desde que se agregó.
- Esto también bloquea el recordatorio por mail de vencimiento del token de Instagram (mismo endpoint, ver "Cambios recientes" 08-05).
- Acción pendiente: generar un `CRON_SECRET` real y setearlo en Vercel Production. No lo generé yo mismo sin que el usuario lo supiera — quedó pendiente de decisión.

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

## Cambios recientes (continuación, mismo 2026-08-01 — checkout/envíos)

**5. "Resto del país" mandaba destino falso a Zipnova (commit `f9226e4`, superado por el punto 7)**
- El dropdown cerrado GBA/CABA/"Resto del país" mandaba el string literal `"Resto del país"` como `destination.city` a Zipnova cuando el usuario elegía esa opción, y `state` quedaba hardcodeado a `'Buenos Aires'` sin importar la provincia real.
- Fix intermedio: se agregaron campos de Ciudad/Provincia (dropdown fijo de 24 provincias) para ese caso puntual — **esta UI quedó reemplazada por el punto 7**, ya no existe.

**6. Autocomplete Georef solo para "Resto del país" (commit `6f6124c`, superado por el punto 7)**
- Paso intermedio: se agregó autocomplete de localidad contra Georef (`apis.datos.gob.ar/georef/api/localidades`, sin auth, CORS abierto) pero solo aplicaba al caso "Resto del país" — GBA/CABA seguían con el dropdown cerrado viejo. **Reemplazado por el combo unificado del punto 7.**

**7. Combo unificado de Localidad — arquitectura actual (commit `57d13be`)**
- Un solo input de autocomplete "Localidad" (`app/checkout/checkout-client.tsx`) busca en **todo el país** vía Georef, sin filtro de provincia previo. Al elegir una sugerencia se guardan `locality` (nombre real) y `province` (de `s.provincia.nombre`) atómicamente.
- `app/lib/shipping-zones.ts` reescrito: `isExpressLocality`/`CABA_LOCALITY`/`OTHER_COUNTRY_LOCALITY`/`resolveProvinceForLocality` → reemplazados por `resolveShippingProvider(locality, province)`. Regla de negocio preservada: cualquier localidad con `provincia.nombre === 'Ciudad Autónoma de Buenos Aires'` es siempre Express (ARTENTINO); si no, matchea normalizado (`normalizeLocalityName`: minúsculas + sin tildes vía `\p{Mn}` tras NFD + sin puntuación) contra la lista fija de GBA (`ShippingZone.localities`, editable en `/admin/extension`) — evita falsos negativos tipo Georef "José C. Paz" vs admin "Jose C Paz".
- `app/checkout/page.tsx` simplificado: ya no consulta `ShippingZone` ni pasa `expressLocalities` como prop (el matching es 100% server-side ahora).
- Cada sugerencia del dropdown muestra `"{nombre} — {provincia}"` **mientras se busca**, y desde el punto 9 también queda visible **de forma persistente** debajo del input una vez elegida.

**8. Bugs de parseo de la respuesta real de Zipnova (commits `6190501`, `393b339`)**
- `app/lib/shipping/zipnova.ts` asumía `data.results` como **array** (`Array.isArray`, `.filter`, `.find`) — la respuesta real de Zipnova (confirmada con logs de Vercel reales, no solo la doc) tiene `results` como **objeto indexado por `service_type.code`** (ej. `{ standard_delivery: {...} }`); `all_results` sí es array pero incluye no-seleccionables.
- Causaba un `TypeError: results.filter is not a function` que crasheaba silenciosamente (catch genérico, sin loguear el body real).
- Fix: `Object.values(results)`, filtra por `selectable === true`, lee `service_type.code`/`name` como objeto (no string), `delivery_time.estimated_delivery` con fallback a `delivery_time.times.total.max`. Se agregó logging real (`console.error` con `request`+`response` crudos) en los 3 caminos de error (400, otro status, shape inesperado en 200) — antes ninguno logueaba el body, solo mensajes cortos.
- Sin opciones seleccionables → error distinguible `'sin_opciones_disponibles'` (antes genérico).

**9. Bug de unidad de peso — sistémico, no dato puntual (commit `9378651`)**
- Cotizar a La Rioja con un "Vaso Café Star" (~113g reales) daba $190.259 de envío. El código convertía `Product.weight * 1000` asumiendo kg→gramos.
- **Auditoría de los 155 productos con peso cargado (read-only, antes de tocar nada) confirmó que TODO el catálogo ya estaba en gramos** (ej. "COMBO HAMACA RESORT" = 30000 → tiene sentido como 30kg reales, absurdo como 30 toneladas). No había ningún producto real en kg — el bug era 100% del código, no del dato.
- Fix: se sacó el `* 1000` en los dos call sites (`app/api/checkout/route.ts`, `app/api/checkout/quote-shipping/route.ts`). **Ningún valor de producto se modificó.** Label del form admin (`app/admin/productos/[id]/editar/tab-info.tsx`) corregido de "Peso (kg)" a "Peso (gramos)", `step` de `0.001` a `1`. El nombre del campo Prisma (`weight`, sin sufijo de unidad) no se tocó — nunca mintió sobre la unidad, solo el label visible.

**10. Cotización automática + provincia persistente (commit `b2c2116`)**
- Antes: la cotización a Zipnova se disparaba recién al hacer click en "Continuar" (paso Envío → Pago), mostrando "A calcular" todo el paso 1.
- Ahora: `useEffect` con debounce de 400ms dispara la cotización automáticamente en cuanto `locality`+`province`+`zip` están completos, con `AbortController` para invalidar la request anterior si el usuario sigue editando. Sidebar muestra "Calculando…" (spinner) / precio real / "No disponible" (error) en tiempo real; "Total" se recalcula solo (deriva de `quotedAmount`). "Continuar" queda deshabilitado sin `quotedAmount` resuelto.
- Debajo del input de Localidad, `"{nombre} — {provincia}"` en gris queda visible siempre que hay una localidad elegida (antes solo se veía durante la búsqueda, en el dropdown).
- **Gotcha de lint:** ambos `useEffect` (búsqueda Georef y auto-cotización) deben mantener TODOS los `setState` dentro del callback del `setTimeout`, nunca en el cuerpo síncrono del effect — la regla `react-hooks/set-state-in-effect` bloquea el build si no.

**Vercel — comandos útiles usados esta sesión para diagnosticar:**
- `vercel logs --since=6h --query "<texto>" --expand -n 50` — busca en runtime logs (solo quedan logueados los errores; una cotización exitosa no deja rastro).
- `vercel inspect <url> --logs | grep -i "cloning\|commit"` — confirma qué commit real corresponde a un deployment (necesario para no diagnosticar contra código viejo).
- `vercel env pull <path> --environment=production` — trae env vars, PERO si están marcadas como **"Sensitive"** en el dashboard de Vercel, vuelven vacías (write-only, protección de la plataforma) — no es un bug del pull. Pasó con `ZIPNOVA_KEY`/`ZIPNOVA_SECRET`.

---

## Cambios recientes (sesión 2026-08-02/08-07 — Zipnova envíos, auth, Instagram, mobile, emails)

**11. Zipnova — Fase "Crear Envíos" automática (commit `888f53c`)**
- Schema: `Order` suma `contactDocument` (DNI/CUIT, requerido por Zipnova), `zipnovaShipmentId` (`Int?`), `zipnovaServiceTypeCode`, `zipnovaShipmentStatus`, `zipnovaShipmentCreatedAt`, `zipnovaShipmentError`.
- Checkout (`app/checkout/checkout-client.tsx` + `app/api/checkout/route.ts`): nuevo campo DNI obligatorio (7-11 dígitos) en el Step 0. El `serviceTypeCode` que devuelve la cotización de Zipnova ya no se descarta — se guarda en el Order.
- `app/lib/shipping/zipnova.ts`: nuevas `createZipnovaShipment()` y `triggerZipnovaShipmentIfNeeded(orderId)` — esta última es idempotente (`if (order.zipnovaShipmentId) return`), solo actúa si `shippingProvider === 'ZIPNOVA'`, nunca throwea (try/catch propio). Se dispara desde el webhook de MP (`newStatus === 'CONFIRMED'`) y desde `updateOrderStatus()` en el admin. Body de creación: `account_id` (misma constante que cotizar), `external_id: order.id`, `service_type`, `sort_by: 'price'`, `origin_id: ZIPNOVA_ORIGIN_ID`, `destination` armado desde `order.shippingAddress` + `contactDocument`, `items` con la misma expansión por cantidad que ya usaba la cotización (`expandQuoteItems()`, extraída como helper compartido).
- Endpoint `app/api/admin/pedidos/[id]/zipnova-label/route.ts` (GET): descarga la etiqueta PDF. `409` de Zipnova → `202 { ready: false }` (etiqueta aún procesándose). Parsea la respuesta buscando el base64 en varias keys posibles (`data`/`content`/`file`/`label`) porque la doc no especifica el shape exacto.
- Bloque nuevo en `/admin/pedidos/[id]` (`zipnova-shipment-block.tsx`): muestra shipmentId+estado+"Descargar etiqueta" si existe, o el error + botón "Reintentar" (`retryZipnovaShipment` Server Action) si falló.
- **Probado contra la API real de Zipnova** (con `ZIPNOVA_KEY`/`SECRET`/`ORIGIN_ID` reales pasados temporalmente por el usuario): cotización + creación de envío reales funcionaron (shipment ID `28682694` creado de verdad en la cuenta 370663/19612 — quedó un envío real activo asociado a una dirección de prueba, pendiente de que Valentín lo cancele con soporte de Zipnova si corresponde).

**12. Fix `NEXT_PUBLIC_BASE_URL` — fallback y blindaje (commit `16b72d3`)**
- `app/layout.tsx`: el fallback de `metadataBase` decía `'https://artentino.com'` (**sin `.ar`** — dominio incorrecto) → corregido a `'https://artentino.com.ar'`.
- `app/api/auth/recuperar-contrasena/route.ts` usaba `process.env.NEXT_PUBLIC_BASE_URL!` (non-null assertion sin fallback real) → si la env var faltara, el link de reset de contraseña podía contener literalmente `"undefined"`.
- Se extrajo `resolveBaseUrl(finalFallback?)` a `app/lib/base-url.ts`, compartida entre `checkout/route.ts` (fallback `localhost:3000`, sin cambios de comportamiento) y `recuperar-contrasena/route.ts` (fallback `https://artentino.com.ar`). Verificado en producción real: el link de reset generado usa `https://artentino.com.ar`, sin `"undefined"`.

**13. Bug de sesión: header no se actualizaba tras loguearse (commit `5ab6754`)**
- Causa raíz: `/login` usaba el `signIn()` **server-side** de NextAuth (`@/auth`) dentro de una Server Action con `redirectTo` — setea la cookie de sesión correctamente, pero nunca notifica al `SessionProvider` client-side (`useSession()` en `header.tsx`), porque ese mecanismo de notificación solo se dispara cuando se llama al `signIn()`/`signOut()` **client-side** de `next-auth/react`. Resultado: el header seguía mostrando "Ingresar" hasta un F5 manual.
- `/registro` nunca tuvo el bug porque ya usaba el patrón correcto (`signIn()` de `next-auth/react` con `redirect:false` + `router.push()` + `router.refresh()`).
- Fix: se reescribió `/login` (`app/login/page.tsx`) para usar el mismo patrón que `/registro` — se eliminó `useActionState`/Server Action (`login()` en `app/actions/auth.ts`, borrada por quedar sin uso; `logout()` se mantiene intacta ahí).

**14. Cambio de contraseña autenticado + notificación por mail (commits `1176ba0`, `b7632b8`)**
- `app/actions/perfil.ts` (nuevo) → `changePassword(_prev, formData)`: valida sesión vía `auth()`, compara `currentPassword` con `bcrypt.compare()` contra el hash guardado, hashea la nueva con `bcrypt.hash(_, 10)` (mismos rounds que el resto del proyecto). UI en `/perfil` (`password-form.tsx`, patrón `useActionState`).
- Nuevo template `passwordChangedEmail()` en `app/lib/email.ts`, disparado (fire-and-forget) tanto desde `changePassword()` como desde `restablecer-contrasena/route.ts` (el flujo de "olvidé mi contraseña" no avisaba nunca cuando el cambio se concretaba — mismo hueco en los dos lugares).

**15. Instagram — flujo nuevo de token + recordatorio de vencimiento (commits `0f2b52c`, `424fbac`)**
- `saveInitialToken()` (`app/admin/instagram/actions.ts`) validaba contra `graph.facebook.com/debug_token` (API vieja, vía Facebook Login) — los tokens del flujo nuevo "Instagram API con inicio de sesión de Instagram" (prefijo `IGAA...`) tiran `"Invalid OAuth access token - Cannot parse access token"` ahí. Fix: valida + resuelve `igUserId` contra `graph.instagram.com/me`, y usa `graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token` (mismo endpoint que ya usaba el cron) para obtener el token de larga duración + `expires_in` real — **confirmado empíricamente que funciona inmediatamente después de generar el token**, pese a que la doc de Meta dice que hay que esperar 24hs (`ig_exchange_token`, la alternativa "correcta" según la doc, falló con "Error validating client secret" — probablemente el App Secret pertenece a otra app de Meta).
- Schema: `InstagramToken.reminderSentAt` (nuevo). El cron (`app/api/cron/instagram-refresh/route.ts`) ahora, además de refrescar, chequea si `tokenAgeDays >= 50 && !reminderSentAt` y manda `instagramTokenReminderEmail()` a todos los `User` con `role: 'ADMIN'`. `saveInstagramToken()` resetea `reminderSentAt` a `null` en cada guardado (paste manual o refresh exitoso), para que el ciclo de aviso se reinicie. **Bloqueado por el problema de `CRON_SECRET` faltante en Vercel** (ver Notas importantes) — no puede correr en producción hasta que se resuelva.

**16. Auditoría + fix de responsividad mobile (commits `2ff4e16`, `7572189`, `185034e`)**
- Nuevo script standalone `e2e/mobile-audit.ts` (no es parte de la suite formal de Playwright) — visita rutas públicas/usuario/admin en 375×667, 390×844, 768×1024, detecta overflow horizontal, touch-targets <44×44px y texto <12px, saca screenshots full-page y arma `mobile-audit-report.md` (raíz del repo) + `e2e/mobile-audit-screenshots/`. Corre por etapas (`public`/`user`/`admin`/`merge`) porque una corrida completa excede el timeout de 10min de una sola invocación.
- **Gotcha de la herramienta:** pasar funciones TS a `page.evaluate()` bajo `tsx` (≥4.15) rompe con `ReferenceError: __name is not defined` — bug conocido de tsx/esbuild, no de Playwright. Fix: el código que corre en el browser se pasa como **string plano** (`page.evaluate(stringDeJS)`), nunca como función compilada por tsx.
- **Gotcha de detección:** un elemento más ancho que el viewport dentro de un ancestro `overflow:hidden` (ej. el ticker del Marquee) o un panel `position:fixed` posicionado fuera de pantalla a propósito (cart drawer/menú mobile cerrado, `translate-x-full`) NO son bugs de layout — se filtran chequeando si el elemento arranca fuera de la franja horizontal visible (`rect.left >= vpWidth`) y si algún ancestro recorta con `overflow:hidden`.
- Fix real de `/admin/pedidos/[id]`: el grid (`grid gap-6 lg:grid-cols-3`) no tenía `grid-cols-1` base ni `min-w-0`, así que no colapsaba a una columna por debajo de `lg` y desbordaba hasta 258px en iPhone SE — mismo patrón de fondo (flex/grid items con `min-width:auto` por defecto) se repitió en el header de esa página (título + `StatusSelect`).
- Fix de componentes compartidos del sitio público (`header.tsx`, `footer.tsx`, `marquee.tsx`, `add-to-cart-button.tsx` — ojo, no `product-card.tsx`, ahí solo viven 2 labels decorativos, el corazón/wishlist y el botón "Agregar" en realidad están en `add-to-cart-button.tsx` —, `category-pills.tsx`, breadcrumbs y varios componentes de `catalogo/[slug]/`): patrón `<tamaño-44px-o-12px> lg:<tamaño-original>` en todos los cambios de tamaño, para no alterar el diseño aprobado en desktop real (≥1024px). Se usó `lg:` como breakpoint de reversión (no `md:`, que es donde el propio header ya cambia a su layout "desktop" en 768px — usar `md:` hubiera anulado el fix justo en el tablet que había que arreglar).
- Resultado verificado (no a ojo, contra el browser real en cada iteración): `crítico` (overflow horizontal) en 0 en toda la sesión — nunca hubo overflow real en el sitio público. `touch-target-chico` bajó de 13 (tope) por página a 2-5 en la mayoría de rutas; lo que queda es contenido propio de `/faq` y `/terminos` (links dentro del texto), fuera del alcance de esta fase.
- **`/admin` no se tocó** (fase explícitamente pospuesta) — el reporte ya documentó hallazgos críticos reales ahí (`/admin` dashboard, `/admin/administradores`, `/admin/auditoria`, `/admin/extension`, `/admin/home`), pendientes.

**17. Copia de mail de compra a admin + unificación de dominio de contacto (commits `4f43cda`, `2c9431a`)**
- `purchaseConfirmationEmail` (usado en el webhook de MP al confirmarse el pago) **no vive en `checkout/route.ts`** — está en `app/api/webhook/mercadopago/route.ts`, y ahí mismo hay un sistema de override: si existe un `EmailTemplate` en DB con `key: 'ORDER_PRE_CONFIRMATION'` (existe en producción), se usa ese HTML en vez del fallback hardcodeado — la copia a admin se agregó **después** de resolver `html` (sea cual sea el origen), no adentro del branch del fallback, para que funcione sin importar cuál se esté usando.
- Ambos flujos (webhook MP y `checkout/route.ts` para cash/transfer) mandan ahora una copia independiente (`sendEmail(...).catch(...)` propio, no bloquea ni depende del mail al cliente) a la dirección de contacto.
- Bug de deploy: esa copia se pusheó primero con `info@artentino.com.ar` — **la dirección correcta es `info@artentino.com`, sin `.ar`** (confirmado por Valentín). Unificadas las 4 ocurrencias que tenían el dominio incorrecto (`checkout/route.ts`, `webhook/mercadopago/route.ts`, `contacto/page.tsx`); el resto del sitio (`footer.tsx`, `faq/page.tsx`, `terminos/page.tsx`, `privacidad/page.tsx`) ya usaba la variante correcta. **`noreply@artentino.com.ar`** (remitente de Resend, dominio de propósito distinto) no se tocó.

---

## Dev

- Puerto local: 3001 (`npm run dev`)
- Admin de prueba: `admin@test.com` / `admin1234` / ADMIN
- DB push: `npx prisma db push --accept-data-loss`
- E2E (`npm run test:e2e`): la DB de test (puerto 5433) corre en un contenedor Docker (`artentino-test-db`, creado ad-hoc esta sesión con `postgres:16-alpine`) — si Docker Desktop no está corriendo o el contenedor no existe, `global-setup.ts` falla en el `db push --force-reset` inicial.
- Auditoría mobile: `npx tsx e2e/mobile-audit.ts <public|user|admin|merge>` — reusa la misma DB de test Docker + reset/seed. Correr las 3 etapas y después `merge` para regenerar `mobile-audit-report.md`. Cada etapa arranca su propio `next dev --port 3001`; si una corrida anterior murió sin limpiar, matar el proceso que quedó escuchando en 3001 antes de reintentar.
