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
    { 
      cityId: paris.id, name: 'Eiffel Tower', description: 'Iconic iron tower', category: 'SIGHTSEEING', 
      estimatedCost: 25.00, duration: 120, tags: ['Architecture', 'Photography', 'History'],
      latitude: 48.8584, longitude: 2.2945, popularity: 98, rating: 4.6, openingTime: '09:00', closingTime: '23:45',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
    },
    { 
      cityId: paris.id, name: 'Louvre Museum', description: 'World largest art museum', category: 'MUSEUM', 
      estimatedCost: 17.00, duration: 180, tags: ['History', 'Culture', 'Architecture'],
      latitude: 48.8606, longitude: 2.3376, popularity: 95, rating: 4.7, openingTime: '09:00', closingTime: '18:00',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
    },
    { 
      cityId: rome.id, name: 'Colosseum', description: 'Ancient amphitheatre', category: 'SIGHTSEEING', 
      estimatedCost: 16.00, duration: 150, tags: ['History', 'Architecture', 'Photography'],
      latitude: 41.8902, longitude: 12.4922, popularity: 99, rating: 4.8, openingTime: '08:30', closingTime: '19:00',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
    },
    { 
      cityId: rome.id, name: 'Vatican Museums', description: 'Papal art collections', category: 'MUSEUM', 
      estimatedCost: 20.00, duration: 240, tags: ['History', 'Culture', 'Religious'],
      latitude: 41.9065, longitude: 12.4536, popularity: 94, rating: 4.6, openingTime: '09:00', closingTime: '18:00',
      imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad011dde4d4f?auto=format&fit=crop&w=800&q=80'
    },
  ];

  for (const act of activitiesToSeed) {
    const existing = await prisma.activity.findFirst({
      where: { cityId: act.cityId, name: act.name },
    });
    if (!existing) {
      await prisma.activity.create({ data: act });
    } else {
      await prisma.activity.update({
        where: { id: existing.id },
        data: act
      });
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
