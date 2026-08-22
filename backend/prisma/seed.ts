import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 0. Mock User (Required for local development auth fallback)
  await prisma.user.upsert({
    where: { email: 'dev@globetrotter.test' },
    update: {},
    create: {
      email: 'dev@globetrotter.test',
      name: 'Local Developer',
      passwordHash: 'dummy_hash_for_dev_only',
    },
  });

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

  const india = await prisma.country.upsert({
    where: { code: 'IN' },
    update: {},
    create: {
      name: 'India',
      code: 'IN',
      slug: 'india',
    },
  });

  const japan = await prisma.country.upsert({
    where: { code: 'JP' },
    update: {},
    create: {
      name: 'Japan',
      code: 'JP',
      slug: 'japan',
    },
  });

  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      name: 'United States',
      code: 'US',
      slug: 'united-states',
    },
  });

  // 2. Destinations
  const paris = await prisma.destination.upsert({
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
      description: 'The Destination of Light',
    },
  });

  const rome = await prisma.destination.upsert({
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
      description: 'The Eternal Destination',
    },
  });

  const indianCities = [
    { name: 'Mumbai', slug: 'mumbai', latitude: 19.0760, longitude: 72.8777, description: 'The City of Dreams' },
    { name: 'Delhi', slug: 'delhi', latitude: 28.7041, longitude: 77.1025, description: 'The Capital City' },
    { name: 'Bengaluru', slug: 'bengaluru', latitude: 12.9716, longitude: 77.5946, description: 'Silicon Valley of India' },
    { name: 'Hyderabad', slug: 'hyderabad', latitude: 17.3850, longitude: 78.4867, description: 'City of Pearls' },
    { name: 'Chennai', slug: 'chennai', latitude: 13.0827, longitude: 80.2707, description: 'Gateway to South India' },
    { name: 'Kolkata', slug: 'kolkata', latitude: 22.5726, longitude: 88.3639, description: 'City of Joy' },
    { name: 'Pune', slug: 'pune', latitude: 18.5204, longitude: 73.8567, description: 'Oxford of the East' },
    { name: 'Jaipur', slug: 'jaipur', latitude: 26.9124, longitude: 75.7873, description: 'The Pink City' },
    { name: 'Ahmedabad', slug: 'ahmedabad', latitude: 23.0225, longitude: 72.5714, description: 'Manchester of India' },
    { name: 'Goa', slug: 'goa', latitude: 15.2993, longitude: 74.1240, description: 'Pearl of the Orient' },
    { name: 'Agra', slug: 'agra', latitude: 27.1767, longitude: 78.0081, description: 'Home of the Taj Mahal' },
    { name: 'Varanasi', slug: 'varanasi', latitude: 25.3176, longitude: 82.9739, description: 'The Spiritual Capital of India' },
  ];

  for (const city of indianCities) {
    await prisma.destination.upsert({
      where: {
        countryId_slug: { countryId: india.id, slug: city.slug },
      },
      update: {},
      create: {
        countryId: india.id,
        name: city.name,
        slug: city.slug,
        latitude: city.latitude,
        longitude: city.longitude,
        description: city.description,
      },
    });
  }

  // 3. Places
  const placesToSeed = [
    { 
      destinationId: paris.id, name: 'Eiffel Tower', description: 'Iconic iron tower', category: 'SIGHTSEEING', 
      estimatedCost: 25.00, duration: 120, tags: 'Architecture,Photography,History',
      latitude: 48.8584, longitude: 2.2945, popularity: 98, rating: 4.6, openingTime: '09:00', closingTime: '23:45',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
    },
    { 
      destinationId: paris.id, name: 'Louvre Museum', description: 'World largest art museum', category: 'MUSEUM', 
      estimatedCost: 17.00, duration: 180, tags: 'History,Culture,Architecture',
      latitude: 48.8606, longitude: 2.3376, popularity: 95, rating: 4.7, openingTime: '09:00', closingTime: '18:00',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
    },
    { 
      destinationId: rome.id, name: 'Colosseum', description: 'Ancient amphitheatre', category: 'SIGHTSEEING', 
      estimatedCost: 16.00, duration: 150, tags: 'History,Architecture,Photography',
      latitude: 41.8902, longitude: 12.4922, popularity: 99, rating: 4.8, openingTime: '08:30', closingTime: '19:00',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
    },
    { 
      destinationId: rome.id, name: 'Vatican Museums', description: 'Papal art collections', category: 'MUSEUM', 
      estimatedCost: 20.00, duration: 240, tags: 'History,Culture,Religious',
      latitude: 41.9065, longitude: 12.4536, popularity: 94, rating: 4.6, openingTime: '09:00', closingTime: '18:00',
      imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad011dde4d4f?auto=format&fit=crop&w=800&q=80'
    },
  ];

  for (const place of placesToSeed) {
    const existing = await prisma.place.findFirst({
      where: { destinationId: place.destinationId, name: place.name },
    });
    if (!existing) {
      await prisma.place.create({ data: place });
    } else {
      await prisma.place.update({
        where: { id: existing.id },
        data: place
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
