import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const userPasswordHash = await bcrypt.hash('User123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      firstName: 'Mobile',
      lastName: 'User',
      passwordHash: userPasswordHash,
      role: 'USER'
    },
    create: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      firstName: 'Mobile',
      lastName: 'User',
      role: 'USER'
    }
  });

  const packages: Array<{
    name: string;
    description: string;
    price: Prisma.Decimal;
    durationWeeks: number;
    status: 'ACTIVE';
  }> = [
    {
      name: 'Basic Wellness Package',
      description: 'Essential wellness services for beginners.',
      price: new Prisma.Decimal('99.99'),
      durationWeeks: 4,
      status: 'ACTIVE'
    },
    {
      name: 'Premium Wellness Package',
      description: 'Comprehensive wellness program with expert support.',
      price: new Prisma.Decimal('299.99'),
      durationWeeks: 12,
      status: 'ACTIVE'
    },
    {
      name: 'Elite Wellness Package',
      description: 'Full-service wellness experience with personalized coaching.',
      price: new Prisma.Decimal('999.99'),
      durationWeeks: 26,
      status: 'ACTIVE'
    }
  ];

  for (const wellnessPackage of packages) {
    const existing = await prisma.wellnessPackage.findFirst({
      where: {
        name: wellnessPackage.name,
        deletedAt: null
      },
      select: { id: true }
    });

    if (existing) {
      await prisma.wellnessPackage.update({
        where: { id: existing.id },
        data: {
          description: wellnessPackage.description,
          price: wellnessPackage.price,
          durationWeeks: wellnessPackage.durationWeeks,
          status: wellnessPackage.status
        }
      });
      continue;
    }

    await prisma.wellnessPackage.create({ data: wellnessPackage });
  }
}

void main()
  .catch(async (error: unknown) => {
    console.error('Failed seeding database', error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
