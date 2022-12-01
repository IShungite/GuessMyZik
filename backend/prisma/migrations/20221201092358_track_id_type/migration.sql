/*
  Warnings:

  - Changed the type of `trackId` on the `GameQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GameQuestion" DROP COLUMN "trackId",
ADD COLUMN     "trackId" DOUBLE PRECISION NOT NULL;
