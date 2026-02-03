/*
  Warnings:

  - Added the required column `latitude` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Kitchen` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KitchenType" AS ENUM ('VEG', 'NON_VEG', 'BOTH');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'OFFICE', 'OTHER');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'DELIVERY_AGENT';

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" "AddressType" NOT NULL;

-- AlterTable
ALTER TABLE "Kitchen" ADD COLUMN     "address" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "type" "KitchenType" NOT NULL;
