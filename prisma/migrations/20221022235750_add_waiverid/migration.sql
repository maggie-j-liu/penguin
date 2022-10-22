/*
  Warnings:

  - A unique constraint covering the columns `[waiverId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - The required column `waiverId` was added to the `Participant` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "waiverId" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_waiverId_key" ON "Participant"("waiverId");
