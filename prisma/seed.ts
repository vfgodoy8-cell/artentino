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
    featured: true,
    categorySlug: 'espejos-led',
  },
  {
    name: 'Lámpara de Pie Negra',
    slug: 'lampara-de-pie-negra',
    description:
      'Lámpara de pie con estructura metálica negra mate. Diseño minimalista que combina con cualquier ambientación. Altura 165cm.',
    price: 189000,
    featured: true,
    categorySlug: 'lamparas',
  },
  {
    name: 'Sillón Relax Gris',
    slug: 'sillon-relax-gris',
    description:
      'Sillón ergonómico tapizado en tela gris premium. Estructura de madera maciza. Perfecto para sala de estar o lectura.',
    price: 298000,
    featured: true,
    categorySlug: 'muebles',
  },
  {
    name: 'Taza Cerámica Pack x6',
    slug: 'taza-ceramica-pack-x6',
    description:
      'Set de 6 tazas de cerámica artesanal. Capacidad 300ml c/u. Apta lavavajillas y microondas. Colores surtidos.',
    price: 8500,
    featured: true,
    categorySlug: 'tazas',
  },
  {
    name: 'Kit Mate Acero Inox',
    slug: 'kit-mate-acero-inox',
    description:
      'Kit completo: mate de acero inoxidable 300ml + bombilla de acero + cepillo de limpieza. Apto lavavajillas.',
    price: 18500,
    featured: true,
    categorySlug: 'mate',
  },
  {
    name: 'Vaso Térmico Chopp 500ml',
    slug: 'vaso-termico-chopp-500ml',
    description:
      'Vaso térmico estilo chopp con doble pared de acero inoxidable. Mantiene frío 24hs y calor 12hs. Tapa a presión.',
    price: 12900,
    featured: true,
    categorySlug: 'vasos-termicos',
  },
]

const APPOINTMENT_CONFIRMATION_HTML = `<!DOCTYPE html><html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 0;background:#F7F7F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:#0eb1c3;padding:36px 32px;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,.75);font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Artentino</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:900;letter-spacing:1px;">¡Turno confirmado!</h1>
    </div>
    <div style="padding:36px 32px;">
      <p style="margin:0 0 8px;color:#1E1E1E;font-size:16px;">Hola <strong>{{nombreCliente}}</strong>,</p>
      <p style="margin:0 0 28px;color:#555;line-height:1.6;">Tu turno fue reservado exitosamente. Te esperamos.</p>
      <div style="background:#F7F7F7;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:7px 0;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;width:38%;">Fecha</td>
            <td style="padding:7px 0;color:#1E1E1E;font-weight:700;">{{fecha}}</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">Hora</td>
            <td style="padding:7px 0;color:#1E1E1E;font-weight:700;">{{hora}} hs</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">Modalidad</td>
            <td style="padding:7px 0;color:#1E1E1E;font-weight:700;">{{modalidad}}</td>
          </tr>
        </table>
      </div>
      <p style="margin:0 0 24px;color:#555;line-height:1.6;">Nos comunicaremos para confirmar los detalles. Si necesitás cambiar o cancelar, escribinos a través de nuestra web.</p>
      <p style="margin:0;color:#0eb1c3;font-weight:900;">Equipo Artentino</p>
    </div>
    <div style="background:#F7F7F7;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#aaa;font-size:12px;">© 2025 Artentino — Colegiales, CABA</p>
    </div>
  </div>
</body></html>`

const ORDER_PRE_CONFIRMATION_HTML = `<!DOCTYPE html><html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 0;background:#F7F7F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:#0eb1c3;padding:36px 32px;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,.75);font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Artentino</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:900;letter-spacing:1px;">¡Gracias por tu compra!</h1>
    </div>
    <div style="padding:36px 32px;">
      <p style="margin:0 0 8px;color:#1E1E1E;font-size:16px;">Hola <strong>{{nombreCliente}}</strong>,</p>
      <p style="margin:0 0 28px;color:#555;line-height:1.6;">Recibimos tu pedido y lo estamos procesando. Te avisamos cuando esté listo.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #eee;">Producto</th>
            <th style="text-align:center;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #eee;">Cant.</th>
            <th style="text-align:right;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #eee;">Precio</th>
          </tr>
        </thead>
        <tbody>{{itemsHtml}}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:16px 0 0;color:#1E1E1E;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Total</td>
            <td style="padding:16px 0 0;text-align:right;color:#1E1E1E;font-weight:900;font-size:20px;">\${{total}}</td>
          </tr>
        </tfoot>
      </table>
      <div style="background:#F7F7F7;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:#555;"><strong style="color:#1E1E1E;">Envío:</strong> {{envio}}</p>
      </div>
      <p style="margin:0;color:#0eb1c3;font-weight:900;">Equipo Artentino</p>
    </div>
    <div style="background:#F7F7F7;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#aaa;font-size:12px;">© 2025 Artentino — Colegiales, CABA</p>
    </div>
  </div>
</body></html>`

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

  // SiteConfig singleton
  await prisma.siteConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', heroIntervalSeconds: 6 },
  })
  console.log('  ✓ SiteConfig')

  // HeroBadges — exactly 2 fixed slots (order 0 and 1)
  const espejosLedId = categoryIds['espejos-led']
  const mueblesId = categoryIds['muebles']
  if (espejosLedId && mueblesId) {
    await prisma.heroBadge.upsert({
      where: { order: 0 },
      update: {},
      create: {
        order: 0,
        categoryId: espejosLedId,
        customSubtitle: 'Redondos, rectangulares y a medida',
        icon: 'lightbulb',
        isActive: true,
      },
    })
    await prisma.heroBadge.upsert({
      where: { order: 1 },
      update: {},
      create: {
        order: 1,
        categoryId: mueblesId,
        customSubtitle: 'Diseño para cada espacio',
        icon: 'sofa',
        isActive: true,
      },
    })
    console.log('  ✓ HeroBadges (2 slots)')
  }

  // EmailTemplates
  await prisma.emailTemplate.upsert({
    where: { key: 'APPOINTMENT_CONFIRMATION' },
    update: {},
    create: {
      key: 'APPOINTMENT_CONFIRMATION',
      name: 'Confirmación de turno al cliente',
      subject: 'Tu turno en Artentino está confirmado',
      htmlBody: APPOINTMENT_CONFIRMATION_HTML,
    },
  })
  await prisma.emailTemplate.upsert({
    where: { key: 'ORDER_PRE_CONFIRMATION' },
    update: {},
    create: {
      key: 'ORDER_PRE_CONFIRMATION',
      name: 'Confirmación de compra al cliente',
      subject: '¡Gracias por tu compra en Artentino!',
      htmlBody: ORDER_PRE_CONFIRMATION_HTML,
    },
  })
  console.log('  ✓ EmailTemplates (2)')

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
