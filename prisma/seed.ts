import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: { name: 'ADMIN' },
    create: { id: 1, name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { id: 2 },
    update: { name: 'USER' },
    create: { id: 2, name: 'USER' },
  });

  console.log('Seeded roles:', { adminRole, userRole });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
