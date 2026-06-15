import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg(connectionString)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding test database...')

  const adminHash = await bcrypt.hash('Admin1234!', 10)
  const userHash = await bcrypt.hash('User1234!', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@artentino.test',
      password: adminHash,
      name: 'Admin Test',
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@artentino.test',
      password: userHash,
      name: 'Usuario Test',
      role: 'USER',
    },
  })

  const catEspejos = await prisma.category.create({
    data: { name: 'Espejos LED', slug: 'espejos-led', active: true, sortOrder: 0 },
  })

  const catLamparas = await prisma.category.create({
    data: { name: 'Lámparas', slug: 'lamparas', active: true, sortOrder: 1 },
  })

  const productA = await prisma.product.create({
    data: {
      name: 'Espejo LED Touch 60cm',
      slug: 'espejo-led-touch-60cm',
      description: 'Espejo con iluminación LED regulable y función touch.',
      price: 266000,
      featured: true,
      active: true,
      sortOrder: 0,
      categoryId: catEspejos.id,
    },
  })

  const productB = await prisma.product.create({
    data: {
      name: 'Lámpara de Pie Negra',
      slug: 'lampara-de-pie-negra',
      description: 'Lámpara de pie con estructura metálica negra mate.',
      price: 189000,
      featured: false,
      active: true,
      sortOrder: 1,
      categoryId: catLamparas.id,
    },
  })

  const attr = await prisma.attribute.create({
    data: { name: 'Genérico', hidden: true, active: true },
  })

  const avUnico = await prisma.attributeValue.create({
    data: { attributeId: attr.id, value: 'único' },
  })

  await prisma.productStock.create({
    data: { productId: productA.id, attributeId: attr.id, attributeValueId: avUnico.id, stock: 10 },
  })

  await prisma.productStock.create({
    data: { productId: productB.id, attributeId: attr.id, attributeValueId: avUnico.id, stock: 5 },
  })

  // COLOR attribute with imageDriven — for color-swap E2E tests
  const attrColor = await prisma.attribute.create({
    data: { name: 'COLOR', imageDriven: true, active: true },
  })
  const avAzul = await prisma.attributeValue.create({ data: { attributeId: attrColor.id, value: 'Azul' } })
  const avRojo = await prisma.attributeValue.create({ data: { attributeId: attrColor.id, value: 'Rojo' } })
  const avVerde = await prisma.attributeValue.create({ data: { attributeId: attrColor.id, value: 'Verde' } })

  await prisma.productStock.create({
    data: { productId: productA.id, attributeId: attrColor.id, attributeValueId: avAzul.id, stock: 3 },
  })
  await prisma.productStock.create({
    data: { productId: productA.id, attributeId: attrColor.id, attributeValueId: avRojo.id, stock: 2 },
  })
  await prisma.productStock.create({
    data: { productId: productA.id, attributeId: attrColor.id, attributeValueId: avVerde.id, stock: 1 },
  })

  // ProductImages: general first (becomes defaultImage), then color-specific
  await prisma.productImage.create({
    data: {
      productId: productA.id,
      url: 'https://placehold.co/400x400/e5e7eb/374151?text=Espejo',
      filename: 'espejo-general.jpg',
      size: 10,
      attributeValueId: null,
    },
  })
  await prisma.productImage.create({
    data: {
      productId: productA.id,
      url: 'https://placehold.co/400x400/3b82f6/ffffff?text=Azul',
      filename: 'espejo-azul.jpg',
      size: 10,
      attributeValueId: avAzul.id,
    },
  })
  await prisma.productImage.create({
    data: {
      productId: productA.id,
      url: 'https://placehold.co/400x400/ef4444/ffffff?text=Rojo',
      filename: 'espejo-rojo.jpg',
      size: 10,
      attributeValueId: avRojo.id,
    },
  })
  // Verde has no image — used to test fallback to defaultImage

  // Test order for admin tests
  await prisma.order.create({
    data: {
      userId: user.id,
      total: 266000,
      shippingMethod: 'pickup',
      status: 'PENDING',
      items: {
        create: [{ productId: productA.id, quantity: 1, price: 266000 }],
      },
    },
  })

  console.log(`  ✓ admin: admin@artentino.test / Admin1234!`)
  console.log(`  ✓ user:  user@artentino.test  / User1234!`)
  console.log(`  ✓ categorías: Espejos LED, Lámparas`)
  console.log(`  ✓ productos: ${productA.name}, ${productB.name}`)
  console.log(`  ✓ orden PENDING para user de test`)
  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
