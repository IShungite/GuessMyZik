-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('WAITING', 'PROGRESS', 'END');

-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('FIND_THE_ARTIST', 'FIND_THE_TRACK');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "state" "GameState" NOT NULL DEFAULT 'WAITING',
    "gameMode" "GameMode" NOT NULL DEFAULT 'FIND_THE_ARTIST',
    "joinCode" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "totalPlaylistTrack" INTEGER NOT NULL,
    "maxQuestion" INTEGER NOT NULL,
    "maxSuggestion" INTEGER NOT NULL DEFAULT 4,
    "maxPlayer" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlayer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL,

    CONSTRAINT "GamePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlayerAnswer" (
    "id" TEXT NOT NULL,
    "gamePlayerId" TEXT NOT NULL,

    CONSTRAINT "GamePlayerAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayerAnswer" ADD CONSTRAINT "GamePlayerAnswer_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "GamePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
