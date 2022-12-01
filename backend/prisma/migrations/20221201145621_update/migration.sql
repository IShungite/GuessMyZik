/*
  Warnings:

  - Added the required column `gameAnswerId` to the `GamePlayerAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlayer" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "GamePlayerAnswer" ADD COLUMN     "gameAnswerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GamePlayerAnswer" ADD CONSTRAINT "GamePlayerAnswer_gameAnswerId_fkey" FOREIGN KEY ("gameAnswerId") REFERENCES "GameAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
