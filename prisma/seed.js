const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.createMany({
    data: [
      { status: 'Delivered' },
      { status: 'Out for delivery' },
      { status: 'Processing' },
    ],
  });
  await prisma.inventoryItem.createMany({
  data: [
    { name: 'x', quantity: 25 },
    { name: 'y', quantity: 10 },
    { name: 'z', quantity: 5 },
  ],
});
  console.log('Seeded database with initial data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
