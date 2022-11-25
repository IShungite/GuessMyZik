import { Injectable } from '@nestjs/common';
import { Game, Prisma } from '@prisma/client';
import { DeezerService } from 'src/deezer/deezer.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService, private readonly deezerService: DeezerService) { }

  async create(): Promise<Game> {
    const joinCode = this.createJoinCode();
    const playlist = await this.deezerService.getRandomPlaylist();
    const maxQuestions = Math.ceil(playlist.nb_tracks / 2);

    const game = await this.prisma.game.create({
      data: { joinCode, playlistId: playlist.id, maxQuestions },
    });

    return game;
  }

  createJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async joinGame(gameId: string, userId: string) {
    const currentGamePlayer = await this.prisma.gamePlayer.findMany({
      where: { gameId },
    });

    return this.prisma.gamePlayer.create({
      data: {
        userId,
        gameId,
        isOwner: currentGamePlayer === null,
        isConnected: true,
      },
    });
  }

  async quitGame(joinCode: string, userId: string) {
    const game = await this.prisma.game.findFirst({ where: { joinCode } });

    if (!game) {
      throw new Error("Game doesn't exist");
    }

    const gamePlayer = await this.prisma.gamePlayer.findFirst(
      { where: { gameId: game.id, userId } },
    );

    if (!gamePlayer) {
      throw new Error("GamePlayer doesn't exist");
    }

    return this.prisma.gamePlayer.update(
      { where: { id: gamePlayer.id }, data: { isConnected: false } },
    );
  }

  async findAll() {
    return this.prisma.game.findMany();
  }

  async findOne(where: Prisma.GameWhereUniqueInput) {
    return this.prisma.game.findUnique({ where });
  }

  async findGamePlayers(where: Prisma.GamePlayerWhereInput) {
    return this.prisma.gamePlayer.findMany({
      where,
    });
  }

  async findFirst(where: Prisma.GameWhereInput) {
    return this.prisma.game.findFirstOrThrow({ where });
  }

  async update(id: string, updateGameDto: Prisma.GameUpdateInput) {
    return this.prisma.game.update({
      where: { id },
      data: updateGameDto,
    });
  }

  async remove(id: string) {
    return this.prisma.game.delete({ where: { id } });
  }

  async removeAll() {
    const { count } = await this.prisma.game.deleteMany({ where: { state: 'WAITING' } });
    return count;
  }
}
