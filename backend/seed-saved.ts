import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("No users found in the database!");
    process.exit(1);
  }

  // Get 4 destinations from the database
  const destinations = await prisma.destination.findMany({
    take: 4,
    where: {
      name: {
        in: ['Paris', 'Agra', 'Delhi', 'Mumbai']
      }
    }
  });

  if (destinations.length < 4) {
    const additional = await prisma.destination.findMany({ 
      take: 4 - destinations.length,
      where: {
        id: { notIn: destinations.map(d => d.id) }
      }
    });
    destinations.push(...additional);
  }

  console.log(`Found ${destinations.length} destinations to save for ${users.length} users.`);

  for (const user of users) {
    for (const dest of destinations) {
      await prisma.savedDestination.upsert({
        where: {
          userId_destinationId: {
            userId: user.id,
            destinationId: dest.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          destinationId: dest.id
        }
      });
      console.log(`Saved ${dest.name} for user ${user.email}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
