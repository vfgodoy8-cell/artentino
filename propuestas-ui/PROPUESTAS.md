# Audit visual — Artentino

Audit realizado leyendo el código fuente. Sin modificaciones aún.
Design system respetado: teal `#0eb1c3`, oscuro `#1E1E1E`, Nunito, Dancing Script.

---

## Resumen ejecutivo

El front de Artentino tiene una base sólida: color brand consistente, tipografía legible, jerarquía de precios clara y componentes razonablemente bien construidos. Los problemas principales son de accesibilidad (contraste insuficiente, focus rings faltantes), de identidad de marca (la fuente Dancing Script se carga pero nunca se usa en las páginas), de jerarquía en home (el CategoryBar aparece antes del Hero), y de consistencia en el CTA de los product cards (negro vs teal del resto del sistema).

---

## Problemas por prioridad

### ALTA — Impacto visual y de usabilidad crítico

---

#### 1. Contraste insuficiente en el Hero

**Archivo:** `app/ui/hero.tsx`

El subtítulo del hero usa `text-white/50` (blanco al 50% de opacidad sobre teal). Las stats de abajo usan `text-white/35`. Ambos fallan WCAG AA (ratio < 3:1 sobre `#0eb1c3`). El texto es literalmente invisible en pantallas con brillo bajo o al sol.

```tsx
// Actual — falla contraste
<p className="... text-white/50">Descubrí piezas únicas...</p>
<div className="... text-white/35">{stat.label}</div>

// Propuesta
<p className="... text-white/75">Descubrí piezas únicas...</p>
<div className="... text-white/55">{stat.label}</div>
```

**Impacto:** accesibilidad + legibilidad en todos los dispositivos.

---

#### 2. Dancing Script se carga y nunca se usa

**Archivos:** `app/layout.tsx`, `app/globals.css`

La fuente Dancing Script (variable `--font-script`) se importa y se define en el `<html>` pero no aparece en ningún componente de las páginas públicas. La personalidad del negocio se pierde: "deco, hogar y regalos únicos" pide calidez artesanal, pero todo está escrito en Nunito uppercase bold, que se siente genérico.

**Propuesta:** Usar Dancing Script en al menos 2 lugares de alto impacto:
- El titular `h1` del Hero: `"Deco, hogar y regalos únicos"` podría tener "hogar" o la frase completa en script.
- La palabra "Artentino" en el supratítulo de sección (donde hoy dice `"Artentino"` en teal uppercase).

Ejemplo en Hero:
```tsx
<h1 className="mb-5 text-4xl font-black leading-[1.1] text-white sm:text-6xl">
  Deco, hogar y<br />
  <span className="font-[family-name:var(--font-script)] text-5xl font-normal sm:text-7xl">
    regalos únicos
  </span>
</h1>
```

**Impacto:** identidad de marca inmediata, diferenciación del genérico e-commerce teal.

---

#### 3. CategoryBar aparece ANTES del Hero en home

**Archivos:** `app/page.tsx`, `app/ui/category-bar.tsx`

El orden de renderizado es: `CategoryBar → Hero → ProductGrid → PromoCards`.

Esto significa que el usuario llega al home y ve primero pills de categorías (Todos / Espejos LED / Tazas / etc.) antes de saber qué es el negocio. El Hero de bienvenida queda enterrado.

**Propuesta:** Mover el CategoryBar debajo del Hero:
```tsx
// app/page.tsx — propuesta
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryBar />
      <ProductGrid />
      <PromoCards />
    </>
  )
}
```

**Impacto:** flujo narrativo correcto — primero el pitch del negocio, luego la navegación por producto.

---

#### 4. CTA inconsistente entre Hero y Product Cards

**Archivos:** `app/ui/hero.tsx`, `app/ui/add-to-cart-button.tsx`

El Hero usa teal (`#0eb1c3`) como color primario de acción (botón "Ver catálogo"). Los product cards del ProductGrid usan **negro** (`#1E1E1E`) como color del botón "Agregar", que cambia a teal en hover. Esto invierte la jerarquía de color: el teal debería significar "acción primaria", pero en los cards el negro es la acción primaria.

```tsx
// Actual en add-to-cart-button.tsx (size='sm')
const bgClass = added ? 'bg-[#1E1E1E]' : 'bg-[#1E1E1E] hover:bg-[#0eb1c3]'

// Propuesta: teal como estado base, negro para el estado confirmado
const bgClass = added ? 'bg-[#1E1E1E]' : 'bg-[#0eb1c3] hover:bg-[#0a8f9e]'
```

**Impacto:** coherencia visual del sistema de botones en toda la tienda.

---

#### 5. Inputs del checkout sin focus ring accesible

**Archivo:** `app/checkout/checkout-client.tsx`

Todos los inputs del form tienen `outline-none` sin un ring alternativo. Al hacer foco con teclado no hay indicador visible.

```tsx
// Actual
className="... outline-none focus:border-[#0eb1c3]"

// Propuesta
className="... outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20"
```

**Impacto:** accesibilidad básica para usuarios de teclado, requerimiento legal en varios países.

---

#### 6. Footer sin links legales

**Archivo:** `app/ui/footer.tsx`

La barra inferior del footer solo tiene `"© 2026 Artentino · Todos los derechos reservados"` y `"🔒 Compra segura · MercadoPago"`. No hay links a Política de Privacidad ni Términos y Condiciones. Para un e-commerce que procesa pagos con MercadoPago esto es una omisión de cumplimiento legal.

**Propuesta:** Agregar en el bottom bar:
```tsx
<div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#2a2a2a] py-6 sm:flex-row">
  <p className="text-xs text-[#444]">© 2026 Artentino · Todos los derechos reservados</p>
  <div className="flex items-center gap-4">
    <Link href="/privacidad" className="text-xs text-[#444] hover:text-[#0eb1c3] transition-colors">Privacidad</Link>
    <Link href="/terminos" className="text-xs text-[#444] hover:text-[#0eb1c3] transition-colors">Términos</Link>
    <p className="text-xs text-[#444]">Compra segura · MercadoPago</p>
  </div>
</div>
```

**Impacto:** cumplimiento legal, confianza del usuario.

---

### MEDIA — Mejoras de calidad y coherencia

---

#### 7. No hay indicador de página activa en el nav

**Archivo:** `app/ui/header.tsx`

Los links del nav (`Inicio / Catálogo / Turnos / Contacto`) no tienen ningún estilo activo. El usuario no sabe en qué sección está.

**Propuesta:** Convertir el nav a un Client Component con `usePathname()`:
```tsx
const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
className={`text-sm font-bold uppercase tracking-widest transition-colors ${
  isActive ? 'text-[#0eb1c3]' : 'text-[#1E1E1E] hover:text-[#0eb1c3]'
}`}
```

**Impacto:** orientación del usuario, UX básica de navegación.

---

#### 8. Badge de categoría en product cards a 9px — ilegible

**Archivo:** `app/ui/product-card.tsx` (línea 29)

```tsx
<span className="... text-[9px] font-black uppercase tracking-wider text-white">
  {category.name}
```

9px es demasiado pequeño para ser legible en mobile, especialmente con `tracking-wider`. El badge pierde su función informativa.

**Propuesta:** Subir a `text-[10px]` mínimo (idealmente `text-xs = 12px`) y quitar `tracking-wider` para ganar espacio:
```tsx
<span className="... text-[10px] font-black uppercase text-white">
```

**Impacto:** legibilidad en mobile.

---

#### 9. "Volver al catálogo" demasiado sutil en la ficha de producto

**Archivo:** `app/catalogo/[slug]/page.tsx` (línea 190)

```tsx
<Link href="/catalogo" className="mt-6 text-center text-sm font-semibold text-gray-400 ...">
  ← Volver al catálogo
</Link>
```

`text-gray-400` en un fondo blanco tiene muy bajo contraste (~4.5:1, al límite de WCAG AA). El link de vuelta al catálogo es una ruta de escape crítica para el usuario que no quiere comprar este producto; hacerlo gris lo invisibiliza.

**Propuesta:**
```tsx
<Link href="/catalogo" className="mt-6 text-center text-sm font-semibold text-[#0eb1c3] hover:underline transition-colors">
  ← Volver al catálogo
</Link>
```

**Impacto:** navegación de retorno, experiencia del usuario que explora el catálogo.

---

#### 10. Estado "Procesando..." sin feedback visual en checkout

**Archivo:** `app/checkout/checkout-client.tsx` (línea 389)

El botón "Pagar con MercadoPago" en loading solo cambia el texto a "Procesando..." con `disabled:opacity-60`. No hay spinner, no hay animación, no hay indicación de progreso. El usuario puede pensar que el click no registró.

**Propuesta:** Agregar un spinner inline:
```tsx
{loading ? (
  <span className="flex items-center justify-center gap-2">
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
    </svg>
    Procesando...
  </span>
) : 'Pagar con MercadoPago'}
```

**Impacto:** confianza del usuario durante el pago, previene doble-click.

---

#### 11. Iconos sociales inconsistentes (stroke vs fill)

**Archivo:** `app/ui/footer.tsx`

Instagram, Facebook, YouTube y WhatsApp usan `stroke="currentColor"` (outline). TikTok usa `fill="currentColor"` (sólido). En el mismo row de íconos el cambio de estilo rompe la consistencia visual.

**Propuesta:** Unificar todos a stroke (outline), o todos a fill. La versión outline es más coherente con el resto del sistema de íconos del sitio.

**Impacto:** pulido visual del footer.

---

#### 12. min-h-screen en lugar de min-h-dvh

**Archivos:** `app/checkout/checkout-client.tsx`, `app/catalogo/[slug]/page.tsx`, `app/catalogo/page.tsx`

`min-h-screen` en iOS Safari no descuenta la barra de navegación del browser, causando que el contenido quede cortado o con scroll innecesario.

**Propuesta:** Reemplazar `min-h-screen` por `min-h-dvh` en todas las páginas principales.

**Impacto:** UX mobile en iOS Safari.

---

### BAJA — Polish final

---

#### 13. text-wrap: balance faltante en títulos clave

**Archivos:** `app/ui/hero.tsx`, `app/catalogo/page.tsx`

Los `<h1>` y `<h2>` pueden producir palabras sueltas en la última línea en viewports intermedios. `text-wrap: balance` (soportado en Chrome 114+, Safari 17.5+) equilibra automáticamente los saltos de línea.

```tsx
<h1 className="... text-balance">Deco, hogar y regalos únicos</h1>
```

---

#### 14. Pills del CategoryBar en home no sincronizan con la URL

**Archivo:** `app/ui/category-bar-pills.tsx`

El estado `active` se inicializa siempre en `'Todos'` vía `useState`. Si el usuario llega al home desde un link directo con `?categoria=espejos-led`, las pills no reflejan la categoría activa.

**Propuesta:** Inicializar con `useSearchParams()` o `usePathname()` para sincronizar el estado con la URL.

---

#### 15. og:image faltante en metadata

**Archivo:** `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "Artentino — Deco, hogar y regalos únicos",
  description: "...",
  // falta: openGraph, twitter cards
}
```

Sin og:image, al compartir el link en WhatsApp o Instagram no se genera preview de imagen.

**Propuesta:**
```tsx
export const metadata: Metadata = {
  title: "Artentino — Deco, hogar y regalos únicos",
  description: "...",
  openGraph: {
    title: "Artentino — Deco, hogar y regalos únicos",
    description: "...",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}
```

---

#### 16. Botón "Ver catálogo" en carrito vacío no navega

**Archivo:** `app/ui/cart-drawer.tsx` (línea 67)

```tsx
<button onClick={onClose} ...>Ver catálogo</button>
```

El botón cierra el drawer pero no navega. El texto promete llevar al catálogo pero solo cierra el panel. Reemplazar con `<Link href="/catalogo" onClick={onClose}>`.

---

#### 17. Emoji en footer

**Archivo:** `app/ui/footer.tsx` (línea 186)

```tsx
<p className="text-xs text-[#444]">🔒 Compra segura · MercadoPago</p>
```

El emoji 🔒 renderiza diferente en cada OS y puede verse mal en pantallas de alta densidad o en versiones antiguas de Android. Reemplazar con el SVG de candado que ya existe en el codebase.

---

## Tabla de prioridades

| # | Problema | Archivo(s) | Prioridad | Esfuerzo |
|---|---|---|---|---|
| 1 | Contraste hero (white/50, white/35) | `hero.tsx` | ALTA | Bajo |
| 2 | Dancing Script sin usar | `hero.tsx`, otros | ALTA | Bajo |
| 3 | CategoryBar antes del Hero | `page.tsx` | ALTA | Mínimo |
| 4 | CTA inconsistente cards vs hero | `add-to-cart-button.tsx` | ALTA | Bajo |
| 5 | Inputs sin focus ring | `checkout-client.tsx` | ALTA | Bajo |
| 6 | Footer sin links legales | `footer.tsx` | ALTA | Bajo |
| 7 | Nav sin active state | `header.tsx` | MEDIA | Medio |
| 8 | Badge categoría a 9px | `product-card.tsx` | MEDIA | Mínimo |
| 9 | "Volver al catálogo" gris | `[slug]/page.tsx` | MEDIA | Mínimo |
| 10 | "Procesando..." sin spinner | `checkout-client.tsx` | MEDIA | Bajo |
| 11 | Iconos footer inconsistentes | `footer.tsx` | MEDIA | Bajo |
| 12 | min-h-screen vs min-h-dvh | varios | MEDIA | Mínimo |
| 13 | text-wrap: balance | `hero.tsx`, catálogo | BAJA | Mínimo |
| 14 | Pills no sincronizan con URL | `category-bar-pills.tsx` | BAJA | Medio |
| 15 | og:image faltante | `layout.tsx` | BAJA | Bajo |
| 16 | "Ver catálogo" en carrito no navega | `cart-drawer.tsx` | BAJA | Mínimo |
| 17 | Emoji 🔒 en footer | `footer.tsx` | BAJA | Mínimo |

---

## Lo que está bien — no tocar

- Paleta de colores: `#0eb1c3`, `#0a8f9e`, `#1E1E1E` aplicada con consistencia.
- Uso de hex arbitrario en Tailwind (correcto para Tailwind v4).
- Hover states en cards (`-translate-y-1 shadow-xl`) — bien ejecutado.
- CartDrawer: overlay, animación slide, manejo de cantidad — sólido.
- Checkout multi-step con step indicator — buena UX base.
- Marquee animado en el header — agrega energía sin ser intrusivo.
- Breadcrumb en ficha de producto — correcto.
- Estado "Agregado" con feedback temporal (1.2s) en add-to-cart — bien pensado.
- Footer oscuro sobre el resto del site claro — la sección oscura es el footer, no rompe el flow (es una convención esperada).
- PromoCards con hover que invierte bg/icon color — microinteracción cuidada.
