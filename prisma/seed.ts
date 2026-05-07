import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg(connectionString)
const prisma = new PrismaClient({ adapter })

const categories = [
  {
    name: 'Espejos LED',
    slug: 'espejos-led',
    description: 'Espejos con iluminación LED regulable para baño y vestidor',
  },
  {
    name: 'Lámparas',
    slug: 'lamparas',
    description: 'Lámparas de pie, mesa y colgantes para todos los ambientes',
  },
  {
    name: 'Muebles',
    slug: 'muebles',
    description: 'Sillones, mesas y muebles de diseño argentino',
  },
  {
    name: 'Tazas',
    slug: 'tazas',
    description: 'Tazas de cerámica artesanal para café y té',
  },
  {
    name: 'Mate',
    slug: 'mate',
    description: 'Mates y accesorios de acero inoxidable y madera',
  },
  {
    name: 'Vasos Térmicos',
    slug: 'vasos-termicos',
    description: 'Vasos y chopps térmicos con doble pared de acero inoxidable',
  },
]

const productData = [
  {
    name: 'Espejo LED Touch 60cm',
    slug: 'espejo-led-touch-60cm',
    description:
      'Espejo inteligente con iluminación LED regulable y función touch. Ideal para baño o vestidor. Luz cálida y fría seleccionable.',
    price: 266000,
    stock: 15,
    featured: true,
    categorySlug: 'espejos-led',
  },
  {
    name: 'Lámpara de Pie Negra',
    slug: 'lampara-de-pie-negra',
    description:
      'Lámpara de pie con estructura metálica negra mate. Diseño minimalista que combina con cualquier ambientación. Altura 165cm.',
    price: 189000,
    stock: 8,
    featured: true,
    categorySlug: 'lamparas',
  },
  {
    name: 'Sillón Relax Gris',
    slug: 'sillon-relax-gris',
    description:
      'Sillón ergonómico tapizado en tela gris premium. Estructura de madera maciza. Perfecto para sala de estar o lectura.',
    price: 298000,
    stock: 5,
    featured: true,
    categorySlug: 'muebles',
  },
  {
    name: 'Taza Cerámica Pack x6',
    slug: 'taza-ceramica-pack-x6',
    description:
      'Set de 6 tazas de cerámica artesanal. Capacidad 300ml c/u. Apta lavavajillas y microondas. Colores surtidos.',
    price: 8500,
    stock: 40,
    featured: true,
    categorySlug: 'tazas',
  },
  {
    name: 'Kit Mate Acero Inox',
    slug: 'kit-mate-acero-inox',
    description:
      'Kit completo: mate de acero inoxidable 300ml + bombilla de acero + cepillo de limpieza. Apto lavavajillas.',
    price: 18500,
    stock: 30,
    featured: true,
    categorySlug: 'mate',
  },
  {
    name: 'Vaso Térmico Chopp 500ml',
    slug: 'vaso-termico-chopp-500ml',
    description:
      'Vaso térmico estilo chopp con doble pared de acero inoxidable. Mantiene frío 24hs y calor 12hs. Tapa a presión.',
    price: 12900,
    stock: 25,
    featured: true,
    categorySlug: 'vasos-termicos',
  },
]

async function main() {
  console.log('Seeding database...')

  const categoryIds: Record<string, string> = {}

  for (const cat of categories) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoryIds[cat.slug] = result.id
    console.log(`  ✓ Category: ${cat.name}`)
  }

  for (const p of productData) {
    const { categorySlug, ...data } = p
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoryId: categoryIds[categorySlug],
      },
    })
    console.log(`  ✓ Product: ${p.name}`)
  }

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
