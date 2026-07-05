/**
 * Migración: Categorías planas → jerarquía Category (padre) + Subcategory (hijo)
 *
 * Ejecutar ANTES de `prisma db push`:
 *   npx tsx prisma/migrate-categories.ts
 *
 * Luego:
 *   npx prisma db push --url "$DATABASE_URL"
 *   npx prisma generate
 */

import 'dotenv/config'
import { Pool } from 'pg'
import { randomUUID } from 'crypto'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// ── Mapeo: slug de categoría vieja → slug del padre nuevo ────────────────────
function getParentSlug(oldSlug: string): string {
  if (oldSlug.startsWith('espejo')) return 'espejos'
  if (oldSlug.startsWith('iluminacion') || oldSlug.startsWith('iluminación')) return 'iluminacion'
  if (oldSlug.startsWith('lampara') || oldSlug.startsWith('lámpara')) return 'lamparas'
  if (oldSlug.startsWith('mueble')) return 'muebles'
  if (oldSlug.startsWith('mampara')) return 'mamparas'
  if (oldSlug.startsWith('cuello')) return 'cuellos'
  if (oldSlug.startsWith('bazar')) return 'bazar'
  if (oldSlug.startsWith('bulto')) return 'bultos-oferta'
  if (oldSlug.startsWith('outlet')) return 'outlet'
  return 'bazar' // fallback
}

const PARENT_CATS = [
  { name: 'Espejos',       slug: 'espejos',       order: 1,  isSpecial: false },
  { name: 'Iluminación',   slug: 'iluminacion',   order: 2,  isSpecial: false },
  { name: 'Lámparas',      slug: 'lamparas',      order: 3,  isSpecial: false },
  { name: 'Muebles',       slug: 'muebles',       order: 4,  isSpecial: false },
  { name: 'Mamparas',      slug: 'mamparas',      order: 5,  isSpecial: false },
  { name: 'Cuellos',       slug: 'cuellos',       order: 6,  isSpecial: false },
  { name: 'Bazar',         slug: 'bazar',         order: 7,  isSpecial: false },
  { name: 'Bultos Oferta', slug: 'bultos-oferta', order: 8,  isSpecial: false },
  { name: 'Outlet',        slug: 'outlet',        order: 9,  isSpecial: false },
  { name: 'Todos',         slug: 'todos',         order: 10, isSpecial: true  },
]

async function main() {
  const client = await pool.connect()
  try {
    // ── 1. Leer estado actual ──────────────────────────────────────────────
    const { rows: oldCats } = await client.query<{
      id: string; name: string; slug: string; sortOrder: number
    }>('SELECT id, name, slug, "sortOrder" FROM categories ORDER BY "sortOrder" ASC')

    console.log('\n📋 Categorías existentes:')
    oldCats.forEach((c) => console.log(`  ${c.slug} → parent: ${getParentSlug(c.slug)}`))

    const { rows: prodCats } = await client.query<{ product_id: string; cat_slug: string }>(
      `SELECT p.id as product_id, c.slug as cat_slug
       FROM products p JOIN categories c ON p."categoryId" = c.id`,
    )
    console.log(`\n📦 Productos a remapear: ${prodCats.length}`)

    const { rows: badgeRows } = await client.query<{
      id: string; order: number; cat_slug: string; customLabel: string | null
      customSubtitle: string; icon: string; isActive: boolean
    }>(
      `SELECT hb.id, hb."order", c.slug as cat_slug, hb."customLabel",
              hb."customSubtitle", hb.icon, hb."isActive"
       FROM hero_badges hb LEFT JOIN categories c ON hb."categoryId" = c.id`,
    )
    console.log(`\n🏷️  Hero badges: ${badgeRows.length}`)

    // ── 2. Comenzar transacción ────────────────────────────────────────────
    await client.query('BEGIN')

    // ── 3. Soltar FK de products → categories ─────────────────────────────
    await client.query(`
      DO $$ DECLARE r RECORD;
      BEGIN
        FOR r IN SELECT conname FROM pg_constraint
          WHERE conrelid = 'products'::regclass AND contype = 'f'
          AND confrelid = 'categories'::regclass
        LOOP EXECUTE 'ALTER TABLE products DROP CONSTRAINT ' || quote_ident(r.conname); END LOOP;
      END $$;
    `)

    // ── 4. Soltar FK de hero_badges → categories ──────────────────────────
    await client.query(`
      DO $$ DECLARE r RECORD;
      BEGIN
        FOR r IN SELECT conname FROM pg_constraint
          WHERE conrelid = 'hero_badges'::regclass AND contype = 'f'
          AND confrelid = 'categories'::regclass
        LOOP EXECUTE 'ALTER TABLE hero_badges DROP CONSTRAINT ' || quote_ident(r.conname); END LOOP;
      END $$;
    `)

    // ── 5. Limpiar dependencias ────────────────────────────────────────────
    await client.query('DELETE FROM hero_badges')
    // Soltar NOT NULL antes de poner NULL en productos
    await client.query('ALTER TABLE products ALTER COLUMN "categoryId" DROP NOT NULL')
    await client.query('UPDATE products SET "categoryId" = NULL')
    await client.query('DELETE FROM categories')

    // ── 6. Adaptar tabla categories para el nuevo schema ──────────────────
    // Agregar columnas nuevas (si no existen)
    await client.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS "isSpecial" BOOLEAN NOT NULL DEFAULT false`)
    await client.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`)
    // Quitar columnas viejas que el nuevo schema no tiene
    await client.query(`ALTER TABLE categories DROP COLUMN IF EXISTS description`)
    await client.query(`ALTER TABLE categories DROP COLUMN IF EXISTS "imageUrl"`)
    await client.query(`ALTER TABLE categories DROP COLUMN IF EXISTS active`)
    await client.query(`ALTER TABLE categories DROP COLUMN IF EXISTS "sortOrder"`)

    // ── 7. Crear tabla subcategories ──────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        "order" INTEGER NOT NULL DEFAULT 0,
        "categoryId" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    // ── 8. Insertar categorías padre ──────────────────────────────────────
    const parentIds: Record<string, string> = {}
    for (const cat of PARENT_CATS) {
      const id = randomUUID()
      await client.query(
        `INSERT INTO categories (id, name, slug, "order", "isSpecial", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [id, cat.name, cat.slug, cat.order, cat.isSpecial],
      )
      parentIds[cat.slug] = id
    }
    console.log('\n✅ Categorías padre insertadas:', Object.keys(parentIds).join(', '))

    // ── 9. Insertar subcategorías (old categories) ────────────────────────
    const subcatIds: Record<string, string> = {} // old slug → new subcategory id
    let subcatOrder = 1
    for (const oldCat of oldCats) {
      const parentSlug = getParentSlug(oldCat.slug)
      const parentId = parentIds[parentSlug]
      const id = randomUUID()
      subcatIds[oldCat.slug] = id
      await client.query(
        `INSERT INTO subcategories (id, name, slug, "order", "categoryId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [id, oldCat.name, oldCat.slug, subcatOrder++, parentId],
      )
    }
    console.log(`✅ Subcategorías insertadas: ${Object.keys(subcatIds).length}`)

    // ── 10. Remapear products.categoryId → subcategories.id ───────────────
    let remapped = 0
    let skipped = 0
    for (const { product_id, cat_slug } of prodCats) {
      const subcatId = subcatIds[cat_slug]
      if (!subcatId) {
        console.warn(`  ⚠️  Sin subcategoría para producto ${product_id} (cat: ${cat_slug})`)
        skipped++
        continue
      }
      await client.query('UPDATE products SET "categoryId" = $1 WHERE id = $2', [subcatId, product_id])
      remapped++
    }
    console.log(`✅ Productos remapeados: ${remapped} (${skipped} omitidos)`)

    // ── 11. Agregar FK de products → subcategories ────────────────────────
    // Usar el nombre que Prisma generaría
    await client.query(`
      ALTER TABLE products
        ADD CONSTRAINT "products_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES subcategories(id)
    `)

    // ── 12. Recrear hero badges con IDs de categorías padre ───────────────
    for (const badge of badgeRows) {
      const parentSlug = badge.cat_slug ? getParentSlug(badge.cat_slug) : 'espejos'
      const parentId = parentIds[parentSlug] ?? parentIds['espejos']
      await client.query(
        `INSERT INTO hero_badges (id, "order", "categoryId", "customLabel", "customSubtitle", icon, "isActive")
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [randomUUID(), badge.order, parentId, badge.customLabel, badge.customSubtitle, badge.icon, badge.isActive],
      )
    }
    if (badgeRows.length === 0) {
      // Sin badges previos → seed mínimo
      const espejosId = parentIds['espejos']
      const mueblesId = parentIds['muebles']
      await client.query(
        `INSERT INTO hero_badges (id, "order", "categoryId", "customLabel", "customSubtitle", icon, "isActive")
         VALUES ($1, 0, $2, NULL, 'Iluminación y estilo', 'mirror', true),
                ($3, 1, $4, NULL, 'Diseño y confort', 'sofa', true)`,
        [randomUUID(), espejosId, randomUUID(), mueblesId],
      )
    }
    console.log(`✅ Hero badges recreados`)

    // ── 13. Agregar FK de hero_badges → categories ────────────────────────
    await client.query(`
      ALTER TABLE hero_badges
        ADD CONSTRAINT "hero_badges_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES categories(id)
    `)

    await client.query('COMMIT')
    console.log('\n🎉 Migración completada exitosamente!')
    console.log('\nPróximos pasos:')
    console.log('  1. npx prisma db push --url "$DATABASE_URL"')
    console.log('  2. npx prisma generate')
    console.log('  3. Reiniciar el servidor')

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('\n❌ Migración falló — rollback ejecutado:', err)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main()
