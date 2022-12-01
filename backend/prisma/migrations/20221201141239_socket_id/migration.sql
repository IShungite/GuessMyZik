/*
  Warnings:

  - Added the required column `socketIs` to the `GamePlayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlayer" ADD COLUMN     "socketIs" TEXT NOT NULL;
