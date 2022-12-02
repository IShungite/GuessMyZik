/*
  Warnings:

  - Added the required column `isRight` to the `GameAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameAnswer" ADD COLUMN     "isRight" BOOLEAN NOT NULL;
