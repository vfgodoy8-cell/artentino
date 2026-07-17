import { PrismaClient } from './app/generated/prisma/client.ts'
const p = new PrismaClient()
const users = await p.user.findMany({ select: { email: true, role: true, name: true } })
console.log(JSON.stringify(users, null, 2))
await p.$disconnect()
