-- AlterTable
ALTER TABLE "ItineraryActivity" ADD COLUMN     "category" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "estimatedCost" DECIMAL(10,2),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "activityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "destination" TEXT NOT NULL DEFAULT 'TBD',
ADD COLUMN     "travelers" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TripStop" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ALTER COLUMN "cityId" DROP NOT NULL;
