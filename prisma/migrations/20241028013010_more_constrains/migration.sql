/*
  Warnings:

  - You are about to alter the column `countryCode` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(2)`.
  - A unique constraint covering the columns `[trackingNumber]` on the table `ShipmentTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "countryCode" SET DATA TYPE CHAR(2);

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentTransaction_trackingNumber_key" ON "ShipmentTransaction"("trackingNumber");
