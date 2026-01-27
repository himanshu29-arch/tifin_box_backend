/*
  Warnings:

  - Added the required column `imageUrl` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tiffinSize` on the `MenuItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TiffinSize" AS ENUM ('HALF', 'FULL');

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "imageUrl" TEXT NOT NULL,
DROP COLUMN "tiffinSize",
ADD COLUMN     "tiffinSize" "TiffinSize" NOT NULL;

-- CreateIndex
CREATE INDEX "MenuItem_kitchenId_idx" ON "MenuItem"("kitchenId");
