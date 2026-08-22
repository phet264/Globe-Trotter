import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find the first user (either the seeded one or their newly registered one)
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!user) {
    console.log("No user found.");
    return;
  }

  // Create a nice 7-day trip to Paris and Rome
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: "European Adventure (Restored Mock)",
      description: "A trip to Paris and Rome to make up for the lost data.",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-07"),
      budget: 3500,
      currency: "INR",
      coverImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
      status: "UPCOMING",
      tripStops: {
        create: [
          {
            city: "Paris",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
            order: 0,
            startDate: new Date("2026-09-01"),
            endDate: new Date("2026-09-04"),
            activities: {
              create: [
                {
                  title: "Eiffel Tower Visit",
                  date: new Date("2026-09-02"),
                  order: 0,
                  estimatedCost: 25,
                  startTime: new Date("2026-09-02T10:00:00Z")
                },
                {
                  title: "Louvre Museum",
                  date: new Date("2026-09-03"),
                  order: 1,
                  estimatedCost: 17,
                  startTime: new Date("2026-09-03T09:00:00Z")
                }
              ]
            }
          },
          {
            city: "Rome",
            country: "Italy",
            latitude: 41.9028,
            longitude: 12.4964,
            order: 1,
            startDate: new Date("2026-09-04"),
            endDate: new Date("2026-09-07"),
            activities: {
              create: [
                {
                  title: "Colosseum Tour",
                  date: new Date("2026-09-05"),
                  order: 0,
                  estimatedCost: 16,
                  startTime: new Date("2026-09-05T14:00:00Z")
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Mock trip created successfully for user:", user.email);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
