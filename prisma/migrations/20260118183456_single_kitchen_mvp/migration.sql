/*
  Warnings:

  - The values [CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CASH] on the enum `PaymentMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `area` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `chefId` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryCharge` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `platformFee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `EarningsLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payout` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PLACED', 'ACCEPTED', 'PREPARED', 'OUT_FOR_DELIVERY', 'DELIVERED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMode_new" AS ENUM ('UPI');
ALTER TABLE "Order" ALTER COLUMN "paymentMode" TYPE "PaymentMode_new" USING ("paymentMode"::text::"PaymentMode_new");
ALTER TABLE "Payment" ALTER COLUMN "mode" TYPE "PaymentMode_new" USING ("mode"::text::"PaymentMode_new");
ALTER TYPE "PaymentMode" RENAME TO "PaymentMode_old";
ALTER TYPE "PaymentMode_new" RENAME TO "PaymentMode";
DROP TYPE "PaymentMode_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "EarningsLedger" DROP CONSTRAINT "EarningsLedger_userId_fkey";

-- DropForeignKey
ALTER TABLE "Kitchen" DROP CONSTRAINT "Kitchen_chefId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_userId_fkey";

-- AlterTable
ALTER TABLE "Kitchen" DROP COLUMN "area",
DROP COLUMN "chefId",
DROP COLUMN "city",
DROP COLUMN "isActive",
DROP COLUMN "isApproved",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryCharge",
DROP COLUMN "platformFee",
DROP COLUMN "taxAmount";

-- DropTable
DROP TABLE "EarningsLedger";

-- DropTable
DROP TABLE "Payout";

-- DropEnum
DROP TYPE "LedgerStatus";
