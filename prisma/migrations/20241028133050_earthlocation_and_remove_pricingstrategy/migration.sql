/*
  Warnings:

  - You are about to drop the column `pricingStrategyId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PricingStrategy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_originId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_pricingStrategyId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingEvent" DROP CONSTRAINT "TrackingEvent_locationId_fkey";

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "pricingStrategyId";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "PricingStrategy";

-- CreateTable
CREATE TABLE "EarthLocation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "administartiveArea" TEXT,
    "postalCode" TEXT,
    "countryCode" CHAR(2),
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EarthLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_originId_fkey" FOREIGN KEY ("originId") REFERENCES "EarthLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "EarthLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "EarthLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
