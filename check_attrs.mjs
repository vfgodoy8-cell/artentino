import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import pkg from './app/generated/prisma/client.js'
const { PrismaClient } = pkg

const adapter = new PrismaPg(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })

const updated = await prisma.attribute.update({
  where: { name: 'COLOR' },
  data: { imageDriven: true },
  select: { name: true, imageDriven: true },
})
console.log('Updated:', JSON.stringify(updated))

await prisma.$disconnect()
