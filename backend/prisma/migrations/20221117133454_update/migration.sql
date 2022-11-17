/*
  Warnings:

  - The values [PROGRESS,END] on the enum `GameState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `maxPlayer` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `maxQuestion` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `maxSuggestion` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameState_new" AS ENUM ('WAITING', 'PLAYING', 'FINISHED');
ALTER TABLE "Game" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "state" TYPE "GameState_new" USING ("state"::text::"GameState_new");
ALTER TYPE "GameState" RENAME TO "GameState_old";
ALTER TYPE "GameState_new" RENAME TO "GameState";
DROP TYPE "GameState_old";
ALTER TABLE "Game" ALTER COLUMN "state" SET DEFAULT 'WAITING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "GamePlayer" DROP CONSTRAINT "GamePlayer_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamePlayerAnswer" DROP CONSTRAINT "GamePlayerAnswer_gamePlayerId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_gameId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "maxPlayer",
DROP COLUMN "maxQuestion",
DROP COLUMN "maxSuggestion",
ADD COLUMN     "maxPlayers" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "maxQuestions" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxSuggestions" INTEGER NOT NULL DEFAULT 4;

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Question";

-- CreateTable
CREATE TABLE "GameQuestion" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GameQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "GameAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayerAnswer" ADD CONSTRAINT "GamePlayerAnswer_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "GamePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameQuestion" ADD CONSTRAINT "GameQuestion_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnswer" ADD CONSTRAINT "GameAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "GameQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
