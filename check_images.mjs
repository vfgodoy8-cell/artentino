import { PrismaClient } from './app/generated/prisma/index.js';
const prisma = new PrismaClient();

const images = await prisma.productImage.findMany({ take: 5 });
console.log('=== ProductImage rows ===');
console.log(JSON.stringify(images, null, 2));

const products = await prisma.product.findMany({
  take: 5,
  select: { id: true, name: true, imageUrl: true },
});
console.log('\n=== Products.imageUrl ===');
console.log(JSON.stringify(products, null, 2));

await prisma.$disconnect();
