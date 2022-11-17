-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "playlistId" DROP NOT NULL,
ALTER COLUMN "totalPlaylistTrack" DROP NOT NULL,
ALTER COLUMN "maxQuestion" SET DEFAULT 1,
ALTER COLUMN "maxPlayer" SET DEFAULT 4;

-- AlterTable
ALTER TABLE "GamePlayer" ALTER COLUMN "isOwner" SET DEFAULT false;
