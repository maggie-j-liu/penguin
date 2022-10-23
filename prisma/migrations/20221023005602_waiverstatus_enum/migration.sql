/*
  Warnings:

  - You are about to drop the column `waiverSigned` on the `Participant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WaiverStatus" AS ENUM ('NOT_SIGNED', 'PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "waiverSigned";
ALTER TABLE "Participant" ADD COLUMN     "waiverStatus" "WaiverStatus" NOT NULL DEFAULT 'NOT_SIGNED';
