# Diagnóstico: selector Categoría/Subcategoría en formularios de producto

Fecha: 2026-07-14. Solo lectura — sin cambios de código ni schema.

## Fase 1 — Schema

```prisma
model Category {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  order         Int           @default(0)
  isSpecial     Boolean       @default(false)
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

`Product.categoryId` (`prisma/schema.prisma:96-97`) es FK directa a **Subcategory**, no a Category:
```prisma
categoryId String
category   Subcategory @relation(fields: [categoryId], references: [id])
```
No hay `onDelete` declarado → default `RESTRICT`. Esto significa que a nivel DB **no se puede borrar una Subcategory que tenga productos asociados** (la FK lo bloquea), y por eso no puede haber `categoryId` huérfano generado por borrado en cascada.

**Datos actuales (DB de producción, vía conteo directo):**
- `Subcategory`: 29 filas
- `Category`: 10 filas
- `Product`: 26 filas
- `Product.categoryId` huérfanos (sin match en `subcategories`): **0**

**Categorías sin ninguna Subcategory creada:**
- `Iluminación` — gap real, bloquearía la carga de productos en esa categoría hasta crear al menos una subcategoría.
- `Todos` (`isSpecial: true`) — sentinel intencional (usado como categoría especial, no como contenedor de productos reales); no es un gap a resolver.

## Fase 2 — Alta de producto (`/admin/productos/nuevo`)

- `app/admin/productos/nuevo/page.tsx:6` → `prisma.subcategory.findMany({ orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }], select: { id: true, name: true } })`. Ya consulta **Subcategory**, no Category.
- `form.tsx:122-124` → `<select>` único, plano:
  ```tsx
  <select value={form.categoryId} onChange={...}>
    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
  </select>
  ```
  Label: `"Categoría *"` (`form.tsx:121`). Las opciones muestran `Subcategory.name` — no hay agrupación por Category padre ni ningún selector en cascada.

## Fase 3 — Edición de producto (`/admin/productos/[id]/editar`)

- `page.tsx:43-46` → mismo patrón: `prisma.subcategory.findMany(...)`.
- `tab-info.tsx:161-163` → mismo `<select>` plano, mismo label `"Categoría *"`, opciones con `Subcategory.name`.
- `form.categoryId` se inicializa directo desde `product.categoryId` (`page.tsx:63`), que es el FK real a Subcategory — value del select = id de **Subcategory**, confirmado.

## Fase 4 — Resumen

| Punto | Resultado |
|---|---|
| Tabla que alimenta el selector (alta y edición) | **Subcategory** en ambos formularios — ya migrado, no queda ningún resabio del modelo viejo de un solo nivel. |
| ¿Label desactualizado? | Sí — dice "Categoría *" pero funcionalmente ya opera sobre subcategorías. Es un desajuste de terminología en la UI, no un bug funcional. |
| Datos faltantes | 1 categoría real sin subcategorías (`Iluminación`) bloquea alta de productos ahí. `Todos` también sin subcategorías pero es sentinel, no aplica. |
| Riesgo de `categoryId` huérfano | Ninguno detectado (0/26) y estructuralmente improbable: la FK sin `onDelete` en cascada impide borrar una Subcategory referenciada. |
| Selector plano vs. jerárquico | Hoy es un único `<select>` con nombres de Subcategory sueltos — sin mostrar la Category padre. Con 29 subcategorías bajo 10 categorías, un usuario no tiene forma de saber a qué categoría padre pertenece cada opción solo mirando el dropdown. |

### Recomendación de UI

Dos selects dependientes (Categoría padre → Subcategoría) es preferible a un único select con path "Categoría › Subcategoría", porque:
- Con 29 subcategorías en una sola lista plana, un dropdown con labels largos tipo "Muebles › Sillones" se vuelve difícil de escanear.
- El flujo de dos pasos reduce el ruido: se filtran ~3 opciones en vez de 29.
- Ya existe el shape de datos necesario (`category.order` disponible en el `orderBy`) — solo falta pasar `categoryId` de la Category padre junto con las subcategorías, o incluir el objeto `category` en el `select` de Prisma.

No se implementó nada — queda pendiente de tu decisión.
