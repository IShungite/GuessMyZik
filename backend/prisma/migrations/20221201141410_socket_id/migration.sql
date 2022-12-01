/*
  Warnings:

  - You are about to drop the column `socketIs` on the `GamePlayer` table. All the data in the column will be lost.
  - Added the required column `socketId` to the `GamePlayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlayer" DROP COLUMN "socketIs",
ADD COLUMN     "socketId" TEXT NOT NULL;
