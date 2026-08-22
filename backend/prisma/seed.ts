import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Countries
  const france = await prisma.country.upsert({
    where: { code: 'FR' },
    update: {},
    create: {
      name: 'France',
      code: 'FR',
      slug: 'france',
    },
  });

  const italy = await prisma.country.upsert({
    where: { code: 'IT' },
    update: {},
    create: {
      name: 'Italy',
      code: 'IT',
      slug: 'italy',
    },
  });

  // 2. Cities
  const paris = await prisma.city.upsert({
    where: {
      countryId_slug: {
        countryId: france.id,
        slug: 'paris',
      },
    },
    update: {},
    create: {
      countryId: france.id,
      name: 'Paris',
      slug: 'paris',
      latitude: 48.8566,
      longitude: 2.3522,
      description: 'The City of Light',
    },
  });

  const rome = await prisma.city.upsert({
    where: {
      countryId_slug: {
        countryId: italy.id,
        slug: 'rome',
      },
    },
    update: {},
    create: {
      countryId: italy.id,
      name: 'Rome',
      slug: 'rome',
      latitude: 41.9028,
      longitude: 12.4964,
      description: 'The Eternal City',
    },
  });

  // 3. Activities
  const activitiesToSeed = [
    { cityId: paris.id, name: 'Eiffel Tower', description: 'Iconic iron tower', category: 'SIGHTSEEING', estimatedCost: 25.00, duration: 120 },
    { cityId: paris.id, name: 'Louvre Museum', description: 'World largest art museum', category: 'MUSEUM', estimatedCost: 17.00, duration: 180 },
    { cityId: rome.id, name: 'Colosseum', description: 'Ancient amphitheatre', category: 'SIGHTSEEING', estimatedCost: 16.00, duration: 150 },
    { cityId: rome.id, name: 'Vatican Museums', description: 'Papal art collections', category: 'MUSEUM', estimatedCost: 20.00, duration: 240 },
  ];

  for (const act of activitiesToSeed) {
    const existing = await prisma.activity.findFirst({
      where: { cityId: act.cityId, name: act.name },
    });
    if (!existing) {
      await prisma.activity.create({ data: act });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
