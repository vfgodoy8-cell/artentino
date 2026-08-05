# Auditoría mobile — Artentino

Generado: 2026-08-05T18:14:18.370Z

## Resumen

| Severidad | Cantidad |
|---|---|
| 🔴 Crítico | 149 |
| 🟡 Medio | 1637 |
| ⚪ Menor | 905 |

Viewports auditados: 375x667 (iPhone SE), 390x844 (iPhone estándar), 768x1024 (tablet)

Rutas/pasadas auditadas: 131 · Rutas/pasos con error (no auditados): 4

**Nota metodológica:** los hallazgos que se repiten idénticos en la mitad o más de las páginas de un mismo viewport (típicamente Header/Footer/Marquee, que están en el layout raíz) se agrupan en la sección "Hallazgos globales" en vez de listarse una vez por cada ruta.

---

## Hallazgos globales (Header/Footer/layout compartido)

### Viewport 375x667 (iPhone SE)

| Severidad | Categoría | Selector | Detalle | Aparece en |
|---|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "" | 38/44 rutas |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.flex.h-10` | 40x40px (mínimo recomendado 44x44) — texto: "" | 42/44 rutas |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" | 25/44 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "COMPRA POR UNIDAD" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "PACK & LOTE MAYORISTA" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Navegar" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Ayuda" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Contacto" | 42/44 rutas |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle | Aparece en |
|---|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "" | 38/44 rutas |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.flex.h-10` | 40x40px (mínimo recomendado 44x44) — texto: "" | 42/44 rutas |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" | 25/44 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "COMPRA POR UNIDAD" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "PACK & LOTE MAYORISTA" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Navegar" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Ayuda" | 42/44 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Contacto" | 42/44 rutas |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle | Aparece en |
|---|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > nav.hidden.items-center > a.text-sm.font-bold` | 51x20px (mínimo recomendado 44x44) — texto: "Inicio" | 41/43 rutas |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > nav.hidden.items-center > a.text-sm.font-bold` | 87x20px (mínimo recomendado 44x44) — texto: "Catálogo" | 41/43 rutas |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > nav.hidden.items-center > a.text-sm.font-bold` | 67x20px (mínimo recomendado 44x44) — texto: "Turnos" | 41/43 rutas |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > nav.hidden.items-center > a.text-sm.font-bold` | 88x20px (mínimo recomendado 44x44) — texto: "Contacto" | 41/43 rutas |
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > a.rounded-full.border` | 90x37px (mínimo recomendado 44x44) — texto: "Ingresar" | 25/43 rutas |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "" | 38/43 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "COMPRA POR UNIDAD" | 41/43 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "PACK & LOTE MAYORISTA" | 41/43 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "CUOTAS SIN INTERÉS" | 41/43 rutas |
| ⚪ menor | texto-chico | `div.overflow-hidden.py-2.5 > div.flex > div.flex.shrink-0 > span.whitespace-nowrap.text-[11px]` | font-size=11px — texto: "ENVÍOS A TODO EL PAÍS" | 41/43 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Navegar" | 41/43 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Ayuda" | 38/43 rutas |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div > h3.mb-5.text-[11px]` | font-size=11px — texto: "Contacto" | 36/43 rutas |

---

## home

Ruta: `/`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/home.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 83x34px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 97x34px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 132x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `section.relative.-mt-16 > div.relative.z-10 > div.flex.flex-col > div.mb-5.text-[11px]` | font-size=11px — texto: "Arte · Diseño · Hogar" |
| ⚪ menor | texto-chico | `section.mx-auto.w-full > div.mb-8.flex > div > p.mb-1.text-[11px]` | font-size=11px — texto: "Lo más vendido" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 83x34px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 97x34px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 139x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `section.relative.-mt-16 > div.relative.z-10 > div.flex.flex-col > div.mb-5.text-[11px]` | font-size=11px — texto: "Arte · Diseño · Hogar" |
| ⚪ menor | texto-chico | `section.mx-auto.w-full > div.mb-8.flex > div > p.mb-1.text-[11px]` | font-size=11px — texto: "Lo más vendido" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 83x34px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 97x34px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `main.flex.flex-1 > section.mx-auto.w-full > div.mb-8.flex > a.hidden.text-sm` | 81x20px (mínimo recomendado 44x44) — texto: "Ver todos →" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.grid-cols-2 > article.group.flex > div.flex.flex-1 > a` | 197x31px (mínimo recomendado 44x44) — texto: "Espejo LED Touch 60cm" |
| 🟡 medio | touch-target-chico | `(resumen)` | 19 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `section.relative.-mt-16 > div.relative.z-10 > div.flex.flex-col > div.mb-5.text-[11px]` | font-size=11px — texto: "Arte · Diseño · Hogar" |
| ⚪ menor | texto-chico | `section.mx-auto.w-full > div.mb-8.flex > div > p.mb-1.text-[11px]` | font-size=11px — texto: "Lo más vendido" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

---

## catalogo

Ruta: `/catalogo`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/catalogo.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mb-6.lg:hidden > div.relative > div.flex.gap-2 > a.cursor-pointer.shrink-0` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > a.cursor-pointer.px-4` | 81x32px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > button.cursor-pointer.border-l` | 25x32px (mínimo recomendado 44x44) — texto: "›" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > a.cursor-pointer.px-4` | 95x32px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > button.cursor-pointer.border-l` | 25x32px (mínimo recomendado 44x44) — texto: "›" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 132x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 132x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `(resumen)` | 17 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `main.min-h-dvh.bg-white > div.relative.h-[180px] > div.absolute.inset-0 > p.mb-2.text-[10px]` | font-size=10px — texto: "Artentino" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Lámparas de Mesa" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mb-6.lg:hidden > div.relative > div.flex.gap-2 > a.cursor-pointer.shrink-0` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > a.cursor-pointer.px-4` | 81x32px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > button.cursor-pointer.border-l` | 25x32px (mínimo recomendado 44x44) — texto: "›" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > a.cursor-pointer.px-4` | 95x32px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > button.cursor-pointer.border-l` | 25x32px (mínimo recomendado 44x44) — texto: "›" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 139x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 139x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `(resumen)` | 17 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `main.min-h-dvh.bg-white > div.relative.h-[180px] > div.absolute.inset-0 > p.mb-2.text-[10px]` | font-size=10px — texto: "Artentino" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Lámparas de Mesa" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mb-6.lg:hidden > div.relative > div.flex.gap-2 > a.cursor-pointer.shrink-0` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > a.cursor-pointer.px-4` | 81x32px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > button.cursor-pointer.border-l` | 25x32px (mínimo recomendado 44x44) — texto: "›" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > a.cursor-pointer.px-4` | 95x32px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `div.flex.gap-2 > div.flex.shrink-0 > div.flex.shrink-0 > button.cursor-pointer.border-l` | 25x32px (mínimo recomendado 44x44) — texto: "›" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 24 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `main.min-h-dvh.bg-white > div.relative.h-[180px] > div.absolute.inset-0 > p.mb-2.text-[10px]` | font-size=10px — texto: "Artentino" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Lámparas de Mesa" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

---

## catalogo-producto-espejo

Ruta: `/catalogo/espejo-led-touch-60cm`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/catalogo-producto-espejo.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 32x20px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 57x20px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 48x20px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 48x40px (mínimo recomendado 44x44) — texto: "Espejos LED" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div.flex.flex-col > div.relative.aspect-square > button.absolute.left-3` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div.flex.flex-col > div.relative.aspect-square > button.absolute.right-3` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "−" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "+" |
| 🟡 medio | touch-target-chico | `div.flex.flex-col > div > div.flex.flex-wrap > button.rounded-full.border` | 51x26px (mínimo recomendado 44x44) — texto: "Azul" |
| 🟡 medio | touch-target-chico | `div.flex.flex-col > div > div.flex.flex-wrap > button.rounded-full.border` | 51x26px (mínimo recomendado 44x44) — texto: "Rojo" |
| 🟡 medio | touch-target-chico | `(resumen)` | 21 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > span.mb-4.inline-flex` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `div.flex.flex-col > div > div.mt-5 > p.mb-2.text-[10px]` | font-size=10px — texto: "Variante" |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.mt-12.grid > div.rounded-xl.bg-gray-50 > p.mb-2.text-[10px]` | font-size=10px — texto: "Descripción" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 32x20px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 57x20px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 48x20px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 48x40px (mínimo recomendado 44x44) — texto: "Espejos LED" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div.flex.flex-col > div.relative.aspect-square > button.absolute.left-3` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div.flex.flex-col > div.relative.aspect-square > button.absolute.right-3` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "−" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "+" |
| 🟡 medio | touch-target-chico | `div.flex.flex-col > div > div.flex.flex-wrap > button.rounded-full.border` | 51x26px (mínimo recomendado 44x44) — texto: "Azul" |
| 🟡 medio | touch-target-chico | `div.flex.flex-col > div > div.flex.flex-wrap > button.rounded-full.border` | 51x26px (mínimo recomendado 44x44) — texto: "Rojo" |
| 🟡 medio | touch-target-chico | `(resumen)` | 22 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > span.mb-4.inline-flex` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `div.flex.flex-col > div > div.mt-5 > p.mb-2.text-[10px]` | font-size=10px — texto: "Variante" |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.mt-12.grid > div.rounded-xl.bg-gray-50 > p.mb-2.text-[10px]` | font-size=10px — texto: "Descripción" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 32x20px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 57x20px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 48x20px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 78x20px (mínimo recomendado 44x44) — texto: "Espejos LED" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div.flex.flex-col > div.relative.aspect-square > button.absolute.left-3` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div.flex.flex-col > div.relative.aspect-square > button.absolute.right-3` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > span.mb-4.inline-flex` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `div.flex.flex-col > div > div.mt-5 > p.mb-2.text-[10px]` | font-size=10px — texto: "Variante" |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.mt-12.grid > div.rounded-xl.bg-gray-50 > p.mb-2.text-[10px]` | font-size=10px — texto: "Descripción" |

---

## catalogo-producto-lampara

Ruta: `/catalogo/lampara-de-pie-negra`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/catalogo-producto-lampara.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 32x20px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 57x20px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 62x20px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 62x40px (mínimo recomendado 44x44) — texto: "Lámparas de Mesa" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "−" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "+" |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > a.mt-6.text-center` | 343x20px (mínimo recomendado 44x44) — texto: "← Volver al catálogo" |
| 🟡 medio | touch-target-chico | `(resumen)` | 15 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > span.mb-4.inline-flex` | font-size=10px — texto: "Lámparas de Mesa" |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.mt-12.grid > div.rounded-xl.bg-gray-50 > p.mb-2.text-[10px]` | font-size=10px — texto: "Descripción" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 32x20px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 57x20px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 62x20px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 62x40px (mínimo recomendado 44x44) — texto: "Lámparas de Mesa" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "−" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "+" |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > a.mt-6.text-center` | 358x20px (mínimo recomendado 44x44) — texto: "← Volver al catálogo" |
| 🟡 medio | touch-target-chico | `(resumen)` | 15 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > span.mb-4.inline-flex` | font-size=10px — texto: "Lámparas de Mesa" |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.mt-12.grid > div.rounded-xl.bg-gray-50 > p.mb-2.text-[10px]` | font-size=10px — texto: "Descripción" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 32x20px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 57x20px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 62x20px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-white > div.mx-auto.max-w-7xl > nav.mb-8.flex > a.transition-colors.hover:text-[#0eb1c3]` | 118x20px (mínimo recomendado 44x44) — texto: "Lámparas de Mesa" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "−" |
| 🟡 medio | touch-target-chico | `div > div.mt-6.flex > div.flex.items-center > button.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "+" |
| 🟡 medio | touch-target-chico | `(resumen)` | 19 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.grid.gap-10 > div.flex.flex-col > span.mb-4.inline-flex` | font-size=10px — texto: "Lámparas de Mesa" |
| ⚪ menor | texto-chico | `div.mx-auto.max-w-7xl > div.mt-12.grid > div.rounded-xl.bg-gray-50 > p.mb-2.text-[10px]` | font-size=10px — texto: "Descripción" |

---

## turnos

Ruta: `/turnos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/turnos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## contacto

Ruta: `/contacto`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/contacto.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-2xl > div.mb-8 > p.mt-2.text-sm > a.font-semibold.text-[#0eb1c3]` | 141x19px (mínimo recomendado 44x44) — texto: "info@artentino.com.ar" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-2xl > div.mb-8 > p.mt-2.text-sm > a.font-semibold.text-[#0eb1c3]` | 141x19px (mínimo recomendado 44x44) — texto: "info@artentino.com.ar" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-2xl > div.mb-8 > p.mt-2.text-sm > a.font-semibold.text-[#0eb1c3]` | 141x19px (mínimo recomendado 44x44) — texto: "info@artentino.com.ar" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 14 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## faq

Ruta: `/faq`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/faq.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 70x30px (mínimo recomendado 44x44) — texto: "Envíos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 123x30px (mínimo recomendado 44x44) — texto: "Formas de pago" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 135x30px (mínimo recomendado 44x44) — texto: "Registro y compra" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 151x30px (mínimo recomendado 44x44) — texto: "Regalos corporativos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 167x30px (mínimo recomendado 44x44) — texto: "Cambios y devoluciones" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p.mt-2 > a.font-semibold` | 267x42px (mínimo recomendado 44x44) — texto: "Av. Corrientes 5022, CABA (CP " |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p.mt-2 > a.font-semibold` | 38x19px (mínimo recomendado 44x44) — texto: "Home" |
| 🟡 medio | touch-target-chico | `div.space-y-6 > div.rounded-2xl.border > div.text-sm.leading-relaxed > a.font-semibold` | 32x19px (mínimo recomendado 44x44) — texto: "login" |
| 🟡 medio | touch-target-chico | `div.space-y-6 > div.rounded-2xl.border > div.text-sm.leading-relaxed > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 70x30px (mínimo recomendado 44x44) — texto: "Envíos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 123x30px (mínimo recomendado 44x44) — texto: "Formas de pago" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 135x30px (mínimo recomendado 44x44) — texto: "Registro y compra" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 151x30px (mínimo recomendado 44x44) — texto: "Regalos corporativos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 167x30px (mínimo recomendado 44x44) — texto: "Cambios y devoluciones" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p.mt-2 > a.font-semibold` | 242x19px (mínimo recomendado 44x44) — texto: "Av. Corrientes 5022, CABA (CP " |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p.mt-2 > a.font-semibold` | 38x19px (mínimo recomendado 44x44) — texto: "Home" |
| 🟡 medio | touch-target-chico | `div.space-y-6 > div.rounded-2xl.border > div.text-sm.leading-relaxed > a.font-semibold` | 32x19px (mínimo recomendado 44x44) — texto: "login" |
| 🟡 medio | touch-target-chico | `div.space-y-6 > div.rounded-2xl.border > div.text-sm.leading-relaxed > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `(resumen)` | 24 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 70x30px (mínimo recomendado 44x44) — texto: "Envíos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 123x30px (mínimo recomendado 44x44) — texto: "Formas de pago" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 135x30px (mínimo recomendado 44x44) — texto: "Registro y compra" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 151x30px (mínimo recomendado 44x44) — texto: "Regalos corporativos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-4xl > div.mt-6.flex > a.rounded-full.border` | 167x30px (mínimo recomendado 44x44) — texto: "Cambios y devoluciones" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.text-sm.leading-relaxed > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `(resumen)` | 28 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## privacidad

Ruta: `/privacidad`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/privacidad.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 132x19px (mínimo recomendado 44x44) — texto: "+54 9 11 3936 3333" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `(resumen)` | 11 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 132x19px (mínimo recomendado 44x44) — texto: "+54 9 11 3936 3333" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `(resumen)` | 11 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 661x42px (mínimo recomendado 44x44) — texto: "+54 9 11 3936 3333" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 15 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## terminos

Ruta: `/terminos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/terminos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 136x19px (mínimo recomendado 44x44) — texto: "Política de Privacidad" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 286x42px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Formas " |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 296x42px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Envíos" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 224x42px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Cambios" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 292x42px (mínimo recomendado 44x44) — texto: "Botón de Arrepentimiento" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 132x19px (mínimo recomendado 44x44) — texto: "+54 9 11 3936 3333" |
| 🟡 medio | touch-target-chico | `(resumen)` | 15 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 275x42px (mínimo recomendado 44x44) — texto: "Política de Privacidad" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 260x19px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Formas " |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 199x19px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Envíos" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 276x42px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Cambios" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 312x42px (mínimo recomendado 44x44) — texto: "Botón de Arrepentimiento" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 132x19px (mínimo recomendado 44x44) — texto: "+54 9 11 3936 3333" |
| 🟡 medio | touch-target-chico | `(resumen)` | 16 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 136x19px (mínimo recomendado 44x44) — texto: "Política de Privacidad" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 260x19px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Formas " |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 199x19px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Envíos" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 665x42px (mínimo recomendado 44x44) — texto: "Preguntas frecuentes → Cambios" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 166x19px (mínimo recomendado 44x44) — texto: "Botón de Arrepentimiento" |
| 🟡 medio | touch-target-chico | `div.rounded-2xl.border > div.space-y-2.text-sm > p > a.font-semibold` | 125x19px (mínimo recomendado 44x44) — texto: "info@artentino.com" |
| 🟡 medio | touch-target-chico | `(resumen)` | 19 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## login

Ruta: `/login`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/login.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-3xl.bg-white > form.space-y-4 > div.text-right > a.text-xs.font-semibold` | 140x16px (mínimo recomendado 44x44) — texto: "¿Olvidaste tu contraseña?" |
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 67x19px (mínimo recomendado 44x44) — texto: "Registrate" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-3xl.bg-white > form.space-y-4 > div.text-right > a.text-xs.font-semibold` | 140x16px (mínimo recomendado 44x44) — texto: "¿Olvidaste tu contraseña?" |
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 67x19px (mínimo recomendado 44x44) — texto: "Registrate" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.rounded-3xl.bg-white > form.space-y-4 > div.text-right > a.text-xs.font-semibold` | 140x16px (mínimo recomendado 44x44) — texto: "¿Olvidaste tu contraseña?" |
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 67x19px (mínimo recomendado 44x44) — texto: "Registrate" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 14 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## registro

Ruta: `/registro`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/registro.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 78x19px (mínimo recomendado 44x44) — texto: "Iniciá sesión" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 78x19px (mínimo recomendado 44x44) — texto: "Iniciá sesión" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 78x19px (mínimo recomendado 44x44) — texto: "Iniciá sesión" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## recuperar-contrasena

Ruta: `/recuperar-contrasena`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/recuperar-contrasena.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 78x19px (mínimo recomendado 44x44) — texto: "Iniciá sesión" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 78x19px (mínimo recomendado 44x44) — texto: "Iniciá sesión" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.w-full.max-w-md > div.rounded-3xl.bg-white > p.mt-6.text-center > a.font-bold.transition-colors` | 78x19px (mínimo recomendado 44x44) — texto: "Iniciá sesión" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## restablecer-contrasena

Ruta: `/restablecer-contrasena?token=invalid-token-audit`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/restablecer-contrasena.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## arrepentimiento

Ruta: `/arrepentimiento`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/arrepentimiento.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## checkout-carrito-vacio

Ruta: `/checkout`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-carrito-vacio.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## checkout-success

Ruta: `/checkout/success`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-success.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## checkout-failure

Ruta: `/checkout/failure`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-failure.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## checkout-pending

Ruta: `/checkout/pending`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-pending.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## checkout-confirmado

Ruta: `/checkout/confirmado?method=cash`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-confirmado.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `main.flex.flex-1 > main.flex.min-h-[70vh] > div.mt-6.w-full > p.mb-1.text-[11px]` | font-size=11px — texto: "Método de pago" |
| ⚪ menor | texto-chico | `main.flex.min-h-[70vh] > div.mt-6.w-full > div.mt-4.border-t > p.mb-1.text-[11px]` | font-size=11px — texto: "Descuento aplicado" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 125x19px (mínimo recomendado 44x44) — texto: "Envío y seguimiento" |
| 🟡 medio | touch-target-chico | `(resumen)` | 8 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `main.flex.flex-1 > main.flex.min-h-[70vh] > div.mt-6.w-full > p.mb-1.text-[11px]` | font-size=11px — texto: "Método de pago" |
| ⚪ menor | texto-chico | `main.flex.min-h-[70vh] > div.mt-6.w-full > div.mt-4.border-t > p.mb-1.text-[11px]` | font-size=11px — texto: "Descuento aplicado" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `main.flex.flex-1 > main.flex.min-h-[70vh] > div.mt-6.w-full > p.mb-1.text-[11px]` | font-size=11px — texto: "Método de pago" |
| ⚪ menor | texto-chico | `main.flex.min-h-[70vh] > div.mt-6.w-full > div.mt-4.border-t > p.mb-1.text-[11px]` | font-size=11px — texto: "Descuento aplicado" |

---

## home-menu-mobile-abierto

Ruta: `/`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/home-menu-mobile-abierto.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 83x34px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 97x34px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 132x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `section.relative.-mt-16 > div.relative.z-10 > div.flex.flex-col > div.mb-5.text-[11px]` | font-size=11px — texto: "Arte · Diseño · Hogar" |
| ⚪ menor | texto-chico | `section.mx-auto.w-full > div.mb-8.flex > div > p.mb-1.text-[11px]` | font-size=11px — texto: "Lo más vendido" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 72x34px (mínimo recomendado 44x44) — texto: "Todos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 83x34px (mínimo recomendado 44x44) — texto: "Espejos" |
| 🟡 medio | touch-target-chico | `div.border-b.border-gray-100 > div.mx-auto.max-w-7xl > div.scrollbar-hide.flex > button.shrink-0.rounded-full` | 97x34px (mínimo recomendado 44x44) — texto: "Lámparas" |
| 🟡 medio | touch-target-chico | `a.block > div.relative.aspect-square > div.absolute.right-3 > button.relative.flex` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > button.relative.mt-4` | 139x40px (mínimo recomendado 44x44) — texto: "AgregarAgregado" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `section.relative.-mt-16 > div.relative.z-10 > div.flex.flex-col > div.mb-5.text-[11px]` | font-size=11px — texto: "Arte · Diseño · Hogar" |
| ⚪ menor | texto-chico | `section.mx-auto.w-full > div.mb-8.flex > div > p.mb-1.text-[11px]` | font-size=11px — texto: "Lo más vendido" |
| ⚪ menor | texto-chico | `article.group.flex > a.block > div.relative.aspect-square > span.absolute.left-3` | font-size=10px — texto: "Espejos LED" |
| ⚪ menor | texto-chico | `article.group.flex > div.flex.flex-1 > div.mt-auto > p.mb-0.5.text-[9px]` | font-size=9px — texto: "Efectivo / Transferencia" |

---

## checkout-step0-contacto

Ruta: `/checkout`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-step0-contacto.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `(resumen)` | 12 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## checkout-step1-envio

Ruta: `/checkout`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-step1-envio.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |
| ⚪ menor | texto-chico | `(resumen)` | 1 elementos de texto adicionales < 12px, no listados individualmente |

---

## checkout-step2-pago

Ruta: `/checkout`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-step2-pago.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `div.space-y-3 > div.flex.items-center > div.flex.flex-1 > span.rounded-full.border` | font-size=10px — texto: "Próximamente" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `div.space-y-3 > div.flex.items-center > div.flex.flex-1 > span.rounded-full.border` | font-size=10px — texto: "Próximamente" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `div.space-y-3 > div.flex.items-center > div.flex.flex-1 > span.rounded-full.border` | font-size=10px — texto: "Próximamente" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |
| ⚪ menor | texto-chico | `(resumen)` | 2 elementos de texto adicionales < 12px, no listados individualmente |

---

## checkout-step3-resumen

Ruta: `/checkout`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/checkout-step3-resumen.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.mx-auto.max-w-7xl > div.flex.items-center > div.flex.items-center > button.relative.flex` | 40x40px (mínimo recomendado 44x44) — texto: "1" |
| 🟡 medio | touch-target-chico | `main.min-h-dvh.bg-[#F7F7F7] > div.mx-auto.max-w-3xl > div.mb-8 > a.mb-4.inline-block` | 134x20px (mínimo recomendado 44x44) — texto: "← Seguir comprando" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.flex.items-center > div.flex.items-center > button.relative.flex > span.absolute.-right-1` | font-size=10px — texto: "1" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Contacto" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Pago" |
| ⚪ menor | texto-chico | `div.mb-8.flex > div.flex.flex-1 > div.flex.flex-col > span.mt-1.text-[10px]` | font-size=10px — texto: "Resumen" |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-start > div.flex.items-center > span.flex.h-5` | font-size=9px — texto: "1" |
| ⚪ menor | texto-chico | `(resumen)` | 1 elementos de texto adicionales < 12px, no listados individualmente |

---

## perfil

Ruta: `/perfil`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/perfil.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 128x38px (mínimo recomendado 44x44) — texto: "Usuario" |
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 111x20px (mínimo recomendado 44x44) — texto: "← Volver al inicio" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 14 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## perfil-pedidos

Ruta: `/perfil/pedidos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/perfil-pedidos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 71x20px (mínimo recomendado 44x44) — texto: "← Mi perfil" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 71x20px (mínimo recomendado 44x44) — texto: "← Mi perfil" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 128x38px (mínimo recomendado 44x44) — texto: "Usuario" |
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 71x20px (mínimo recomendado 44x44) — texto: "← Mi perfil" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 13 elementos interactivos adicionales < 44x44px, no listados individualmente |

---

## perfil-pedido-detalle

Ruta: `/perfil/pedidos/cmsgefxa0000qsstpk92aud8n`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/perfil-pedido-detalle.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 94x20px (mínimo recomendado 44x44) — texto: "← Mis pedidos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 9 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-center > div.flex.items-center > span.flex.h-7` | font-size=11px — texto: "1" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 94x20px (mínimo recomendado 44x44) — texto: "← Mis pedidos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 32x19px (mínimo recomendado 44x44) — texto: "Inicio" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 57x19px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 43x19px (mínimo recomendado 44x44) — texto: "Turnos" |
| 🟡 medio | touch-target-chico | `div > ul.space-y-3 > li > a.text-sm.text-[#374151]` | 56x19px (mínimo recomendado 44x44) — texto: "Contacto" |
| 🟡 medio | touch-target-chico | `(resumen)` | 10 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-center > div.flex.items-center > span.flex.h-7` | font-size=11px — texto: "1" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 128x38px (mínimo recomendado 44x44) — texto: "Usuario" |
| 🟡 medio | touch-target-chico | `main.min-h-screen.bg-[#F7F7F7] > div.mx-auto.max-w-2xl > div.mb-8 > a.mb-4.inline-block` | 94x20px (mínimo recomendado 44x44) — texto: "← Mis pedidos" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `div.grid.gap-10 > div > div.mt-5.flex > a.flex.h-9` | 36x36px (mínimo recomendado 44x44) — texto: "" |
| 🟡 medio | touch-target-chico | `(resumen)` | 14 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `ul.space-y-3 > li.flex.items-center > div.flex.items-center > span.flex.h-7` | font-size=11px — texto: "1" |

---

## admin-dashboard

Ruta: `/admin`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-dashboard.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `(resumen)` | 4 elementos adicionales excediendo el viewport, no listados individualmente |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 30 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-productos

Ruta: `/admin/productos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-productos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > div > form > button` | 67x32px (mínimo recomendado 44x44) — texto: "Reload" |
| 🟡 medio | touch-target-chico | `div > div > div > button` | 56x32px (mínimo recomendado 44x44) — texto: "Back" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > div > form > button` | 67x32px (mínimo recomendado 44x44) — texto: "Reload" |
| 🟡 medio | touch-target-chico | `div > div > div > button` | 56x32px (mínimo recomendado 44x44) — texto: "Back" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > div > form > button` | 67x32px (mínimo recomendado 44x44) — texto: "Reload" |
| 🟡 medio | touch-target-chico | `div > div > div > button` | 56x32px (mínimo recomendado 44x44) — texto: "Back" |

---

## admin-productos-nuevo

Ruta: `/admin/productos/nuevo`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-productos-nuevo.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.mx-auto.max-w-2xl > form.space-y-5.rounded-2xl > div.flex.gap-3 > button.flex-1.rounded-xl` | right=389px, excede por 14px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 27 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 30 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-producto-editar

Ruta: `/admin/productos/cmsgeit2j0006cktpi533y22j/editar`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-producto-editar.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.animate-tab-enter > div.space-y-6 > div.flex.items-center > button.rounded-xl.px-8` | right=439px, excede por 64px |
| 🔴 crítico | elemento-excede-viewport | `div > div.mb-6.border-b > nav.flex.gap-0 > button.border-b-2.px-6` | right=422px, excede por 47px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.mx-auto.max-w-5xl > div.mb-6.flex > span.mt-1.inline-flex` | right=418px, excede por 43px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-6 > div > div.mb-3.flex > button.text-xs.font-bold` | right=399px, excede por 24px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.animate-tab-enter > div.space-y-6 > div.flex.items-center > button.rounded-xl.px-8` | right=439px, excede por 49px |
| 🔴 crítico | elemento-excede-viewport | `div > div.mb-6.border-b > nav.flex.gap-0 > button.border-b-2.px-6` | right=422px, excede por 32px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.mx-auto.max-w-5xl > div.mb-6.flex > span.mt-1.inline-flex` | right=418px, excede por 28px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-6 > div > div.mb-3.flex > button.text-xs.font-bold` | right=399px, excede por 9px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 33 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-categorias

Ruta: `/admin/categorias`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-categorias.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 31 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 31 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 41 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-atributos

Ruta: `/admin/atributos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-atributos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div > div.mb-4.flex > input.ml-auto.rounded-xl` | right=568px, excede por 178px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 36 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `tbody.divide-y.divide-gray-50 > tr.transition-colors.hover:bg-gray-50 > td.px-4.py-3 > button.rounded-full.px-2.5` | font-size=10px — texto: "No" |
| ⚪ menor | texto-chico | `tbody.divide-y.divide-gray-50 > tr.transition-colors.hover:bg-gray-50 > td.px-4.py-3 > button.rounded-full.px-2.5` | font-size=10px — texto: "No" |
| ⚪ menor | texto-chico | `tbody.divide-y.divide-gray-50 > tr.transition-colors.hover:bg-gray-50 > td.px-4.py-3 > button.rounded-full.px-2.5` | font-size=10px — texto: "Sí" |
| ⚪ menor | texto-chico | `tbody.divide-y.divide-gray-50 > tr.transition-colors.hover:bg-gray-50 > td.px-4.py-3 > button.rounded-full.px-2.5` | font-size=10px — texto: "No" |
| ⚪ menor | texto-chico | `tbody.divide-y.divide-gray-50 > tr.transition-colors.hover:bg-gray-50 > td.px-4.py-3 > button.rounded-full.px-2.5` | font-size=10px — texto: "Sí" |
| ⚪ menor | texto-chico | `tbody.divide-y.divide-gray-50 > tr.transition-colors.hover:bg-gray-50 > td.px-4.py-3 > button.rounded-full.px-2.5` | font-size=10px — texto: "No" |
| ⚪ menor | texto-chico | `(resumen)` | 2 elementos de texto adicionales < 12px, no listados individualmente |

---

## admin-destacados

Ruta: `/admin/destacados`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-destacados.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > div > form > button` | 67x32px (mínimo recomendado 44x44) — texto: "Reload" |
| 🟡 medio | touch-target-chico | `div > div > div > button` | 56x32px (mínimo recomendado 44x44) — texto: "Back" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > div > form > button` | 67x32px (mínimo recomendado 44x44) — texto: "Reload" |
| 🟡 medio | touch-target-chico | `div > div > div > button` | 56x32px (mínimo recomendado 44x44) — texto: "Back" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div > div > form > button` | 67x32px (mínimo recomendado 44x44) — texto: "Reload" |
| 🟡 medio | touch-target-chico | `div > div > div > button` | 56x32px (mínimo recomendado 44x44) — texto: "Back" |

---

## admin-pedidos

Ruta: `/admin/pedidos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-pedidos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.mb-6.flex > a.rounded-full.border` | right=396px, excede por 21px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.mb-6.flex > a.rounded-full.border` | right=389px, excede por 14px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.mb-6.flex > a.rounded-full.border` | right=388px, excede por 13px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.mb-6.flex > a.rounded-full.border` | right=386px, excede por 11px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.mb-6.flex > div` | right=379px, excede por 4px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.mb-6.flex > div > h1.text-2xl.font-black` | right=379px, excede por 4px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.mb-6.flex > div > p.mt-0.5.text-sm` | right=379px, excede por 4px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.mb-6.flex > a.rounded-full.border > span.ml-1.5.opacity-70` | right=379px, excede por 4px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 31 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "ID" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Cliente" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.mb-6.flex > a.rounded-full.border` | right=396px, excede por 6px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 32 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "ID" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Cliente" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 36 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "ID" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Cliente" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Fecha" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Ítems" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Total" |
| ⚪ menor | texto-chico | `table.w-full.text-sm > thead > tr.border-b.border-gray-100 > th.px-4.py-3` | font-size=10px — texto: "Envío" |
| ⚪ menor | texto-chico | `(resumen)` | 2 elementos de texto adicionales < 12px, no listados individualmente |

---

## admin-pedido-detalle

Ruta: `/admin/pedidos/cmsgeit5y000qcktpmsvfpbiy`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-pedido-detalle.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.grid.gap-6 > div.lg:col-span-2` | right=633px, excede por 258px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.lg:col-span-2 > div.overflow-hidden.rounded-2xl` | right=633px, excede por 258px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col` | right=633px, excede por 258px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border` | right=633px, excede por 258px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border` | right=633px, excede por 258px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border` | right=633px, excede por 258px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | right=612px, excede por 237px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | right=612px, excede por 237px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.font-semibold.text-[#1E1E1E]` | right=612px, excede por 237px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.text-sm.text-gray-400` | right=612px, excede por 237px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | right=612px, excede por 237px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.font-semibold.text-[#1E1E1E]` | right=612px, excede por 237px |
| 🔴 crítico | elemento-excede-viewport | `(resumen)` | 6 elementos adicionales excediendo el viewport, no listados individualmente |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 27 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `div.lg:col-span-2 > div.overflow-hidden.rounded-2xl > div.border-b.border-gray-100 > p.text-[10px].font-black` | font-size=10px — texto: "Productos" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Estado actual" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Cliente" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Envío" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.grid.gap-6 > div.lg:col-span-2` | right=633px, excede por 243px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.lg:col-span-2 > div.overflow-hidden.rounded-2xl` | right=633px, excede por 243px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col` | right=633px, excede por 243px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border` | right=633px, excede por 243px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border` | right=633px, excede por 243px |
| 🔴 crítico | elemento-excede-viewport | `div.p-6.lg:p-8 > div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border` | right=633px, excede por 243px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | right=612px, excede por 222px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | right=612px, excede por 222px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.font-semibold.text-[#1E1E1E]` | right=612px, excede por 222px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.text-sm.text-gray-400` | right=612px, excede por 222px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | right=612px, excede por 222px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.font-semibold.text-[#1E1E1E]` | right=612px, excede por 222px |
| 🔴 crítico | elemento-excede-viewport | `(resumen)` | 3 elementos adicionales excediendo el viewport, no listados individualmente |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `div.lg:col-span-2 > div.overflow-hidden.rounded-2xl > div.border-b.border-gray-100 > p.text-[10px].font-black` | font-size=10px — texto: "Productos" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Estado actual" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Cliente" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Envío" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 30 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |
| ⚪ menor | texto-chico | `div.lg:col-span-2 > div.overflow-hidden.rounded-2xl > div.border-b.border-gray-100 > p.text-[10px].font-black` | font-size=10px — texto: "Productos" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Estado actual" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Cliente" |
| ⚪ menor | texto-chico | `div.grid.gap-6 > div.flex.flex-col > div.rounded-2xl.border > p.mb-3.text-[10px]` | font-size=10px — texto: "Envío" |

---

## admin-turnos

Ruta: `/admin/turnos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-turnos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 33 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-contactos

Ruta: `/admin/contactos`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-contactos.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 33 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-home

Ruta: `/admin/home`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-home.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.space-y-12 > div > div.mb-6.flex > div.flex.items-center` | right=556px, excede por 181px |
| 🔴 crítico | elemento-excede-viewport | `div > div.max-w-2xl.space-y-2 > div.flex.items-center > input.flex-1.rounded-xl` | right=469px, excede por 94px |
| 🔴 crítico | elemento-excede-viewport | `div > div.mb-6.flex > div.flex.items-center > input.w-16.rounded-lg` | right=413px, excede por 38px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-12 > div > div.mb-6.flex > button.inline-flex.h-7` | right=411px, excede por 36px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 35 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.space-y-12 > div > div.mb-6.flex > div.flex.items-center` | right=556px, excede por 166px |
| 🔴 crítico | elemento-excede-viewport | `div > div.max-w-2xl.space-y-3 > div.flex.items-center > button.rounded-xl.px-4` | right=471px, excede por 81px |
| 🔴 crítico | elemento-excede-viewport | `div > div.max-w-2xl.space-y-2 > div.flex.items-center > input.flex-1.rounded-xl` | right=469px, excede por 79px |
| 🔴 crítico | elemento-excede-viewport | `div > div.mb-6.flex > div.flex.items-center > input.w-16.rounded-lg` | right=413px, excede por 23px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-12 > div > div.mb-6.flex > button.inline-flex.h-7` | right=411px, excede por 21px |
| 🔴 crítico | elemento-excede-viewport | `div > div.mb-6.flex > button.inline-flex.h-7 > span.h-5.w-5` | right=407px, excede por 17px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 33 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 50 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-emails

Ruta: `/admin/emails`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-emails.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 29 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-instagram

Ruta: `/admin/instagram`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-instagram.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 27 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 30 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-extension

Ruta: `/admin/extension`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-extension.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.max-w-3xl.space-y-6 > div.rounded-2xl.border > div.flex.gap-2 > input.flex-1.rounded-xl` | right=497px, excede por 122px |
| 🔴 crítico | elemento-excede-viewport | `div.max-w-3xl.space-y-6 > div.rounded-2xl.border > div.flex.items-center > div` | right=408px, excede por 33px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.flex.items-center > div > p.font-semibold.text-[#1E1E1E]` | right=408px, excede por 33px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.flex.items-center > div > p.text-sm.text-gray-500` | right=408px, excede por 33px |
| 🔴 crítico | elemento-excede-viewport | `div.flex.items-center > div > p.text-sm.text-gray-500 > code.rounded.bg-gray-100` | right=408px, excede por 33px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.space-y-3 > div.flex.items-center > div` | right=394px, excede por 19px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-3 > div.flex.items-center > div > p.font-semibold.text-[#1E1E1E]` | right=394px, excede por 19px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-3 > div.flex.items-center > div > p.text-sm.text-gray-500` | right=394px, excede por 19px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.space-y-3 > div.flex.items-center > div` | right=386px, excede por 11px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-3 > div.flex.items-center > div > p.font-semibold.text-[#1E1E1E]` | right=386px, excede por 11px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-3 > div.flex.items-center > div > p.text-sm.text-gray-500` | right=386px, excede por 11px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `div.max-w-3xl.space-y-6 > div.rounded-2xl.border > div.flex.gap-2 > input.flex-1.rounded-xl` | right=497px, excede por 107px |
| 🔴 crítico | elemento-excede-viewport | `div.max-w-3xl.space-y-6 > div.rounded-2xl.border > div.flex.items-center > div` | right=408px, excede por 18px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.flex.items-center > div > p.font-semibold.text-[#1E1E1E]` | right=408px, excede por 18px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.flex.items-center > div > p.text-sm.text-gray-500` | right=408px, excede por 18px |
| 🔴 crítico | elemento-excede-viewport | `div.flex.items-center > div > p.text-sm.text-gray-500 > code.rounded.bg-gray-100` | right=408px, excede por 18px |
| 🔴 crítico | elemento-excede-viewport | `div.rounded-2xl.border > div.space-y-3 > div.flex.items-center > div` | right=394px, excede por 4px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-3 > div.flex.items-center > div > p.font-semibold.text-[#1E1E1E]` | right=394px, excede por 4px |
| 🔴 crítico | elemento-excede-viewport | `div.space-y-3 > div.flex.items-center > div > p.text-sm.text-gray-500` | right=394px, excede por 4px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 32 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-administradores

Ruta: `/admin/administradores`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-administradores.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `(resumen)` | 4 elementos adicionales excediendo el viewport, no listados individualmente |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 29 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## admin-auditoria

Ruta: `/admin/auditoria`

### Viewport 375x667 (iPhone SE)

Screenshot: `e2e/mobile-audit-screenshots/admin-auditoria.png`

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 65px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 40px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 40px |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 25 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 390x844 (iPhone estándar)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `main.flex-1.overflow-y-auto > div.p-8 > div.grid.gap-5 > div.rounded-2xl.border` | right=440px, excede por 50px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.p-8 > div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `div.grid.gap-5 > div.rounded-2xl.border > div.flex.items-start > div.flex.h-12` | right=415px, excede por 25px |
| 🔴 crítico | elemento-excede-viewport | `(resumen)` | 4 elementos adicionales excediendo el viewport, no listados individualmente |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Categorías" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Atributos" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Destacados" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Ventas" |
| 🟡 medio | touch-target-chico | `(resumen)` | 26 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

### Viewport 768x1024 (tablet)

| Severidad | Categoría | Selector | Detalle |
|---|---|---|---|
| 🟡 medio | touch-target-chico | `div.flex.items-center > div.flex.items-center > div.relative.hidden > button.flex.items-center` | 120x38px (mínimo recomendado 44x44) — texto: "Admin" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-2.space-y-0.5 > a.flex.items-center` | 216x36px (mínimo recomendado 44x44) — texto: "Dashboard" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Contenido" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Hero / Home" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Templates de email" |
| 🟡 medio | touch-target-chico | `aside.flex.h-full > nav.flex-1.overflow-y-auto > div.mb-1 > button.flex.w-full` | 216x32px (mínimo recomendado 44x44) — texto: "Catálogo" |
| 🟡 medio | touch-target-chico | `nav.flex-1.overflow-y-auto > div.mb-1 > div.ml-2.space-y-0.5 > a.flex.items-center` | 199x36px (mínimo recomendado 44x44) — texto: "Productos" |
| 🟡 medio | touch-target-chico | `(resumen)` | 30 elementos interactivos adicionales < 44x44px, no listados individualmente |
| ⚪ menor | texto-chico | `div.fixed.inset-0 > aside.flex.h-full > div.border-b.border-[#2a2a2a] > p.mt-2.text-[10px]` | font-size=10px — texto: "Admin" |

---

## Rutas/pasos no auditados (error o excluidos)

| Ruta | Motivo |
|---|---|
| cart-drawer @ 375x667 (iPhone SE) | TimeoutError: page.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('button[aria-label="Ver carrito"]')[22m
[2m    - locator resolved to <button aria-label="Ver carrito" class= |
| cart-drawer @ 390x844 (iPhone estándar) | TimeoutError: page.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('button[aria-label="Ver carrito"]')[22m
[2m    - locator resolved to <button aria-label="Ver carrito" class= |
| cart-drawer @ 768x1024 (tablet) | TimeoutError: page.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('button[aria-label="Ver carrito"]')[22m
[2m    - locator resolved to <button aria-label="Ver carrito" class= |
| /admin/turnos/[id] | excluida — seed-test.ts no crea ningún Appointment, no hay un id real para resolver |

