-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "openingTime" TEXT,
ADD COLUMN     "popularity" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "interests" TEXT[];
