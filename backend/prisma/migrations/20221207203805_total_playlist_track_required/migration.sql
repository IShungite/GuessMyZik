/*
  Warnings:

  - Made the column `totalPlaylistTrack` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `number` to the `GameQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "currentQuestionNumber" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "totalPlaylistTrack" SET NOT NULL;

-- AlterTable
ALTER TABLE "GameQuestion" ADD COLUMN     "number" INTEGER NOT NULL;
