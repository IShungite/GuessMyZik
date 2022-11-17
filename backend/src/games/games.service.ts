import { Injectable } from '@nestjs/common';
import { Game, GamePlayer, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) { }

  async create(): Promise<{ game: Game, gamePlayer: GamePlayer }> {
    const user = await this.prisma.user.findUnique({ where: { username: 'ianis' } });

    const joinCode = this.createJoinCode();
    const game = await this.prisma.game.create({
      data: { joinCode },
    });

    const gamePlayer = await this.prisma.gamePlayer.create({
      data: {
        userId: user.id,
        gameId: game.id,
        isOwner: true,
      },
    });

    return { game, gamePlayer };
  }

  createJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async findAll() {
    return this.prisma.game.findMany();
  }

  async findOne(id: string) {
    return this.prisma.game.findUnique({ where: { id } });
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
