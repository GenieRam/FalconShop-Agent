const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Step 1: Create dummy user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  // Step 2: Create some products
  await prisma.product.createMany({
    data: [
      { name: 'Quantum Laptop', price: 1500, category: 'Electronics', stock: 20 },
      { name: 'Ergo Keyboard', price: 120, category: 'Accessories', stock: 50 },
      { name: '4K Monitor', price: 800, category: 'Electronics', stock: 15 },
    ],
  });

  // Step 3: Create some orders
  await prisma.order.createMany({
    data: [
      { userId: user.id, status: 'Delivered' },
      { userId: user.id, status: 'Out for delivery' },
      { userId: user.id, status: 'Processing' },
    ],
  });

  await prisma.policy.createMany({
  data: [
    { type: "returns", content: "You can return items within 30 days." },
    { type: "shipping", content: "We offer 2-day free shipping." },
  ],
})

  console.log('✅ Seeded database with initial data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
