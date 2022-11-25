/*
  Warnings:

  - Made the column `playlistId` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "playlistId" SET NOT NULL;

-- AlterTable
ALTER TABLE "GamePlayer" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT false;
