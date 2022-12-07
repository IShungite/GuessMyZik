import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) { }

  findAllPlayed(id: string) {
    return this.prisma.game.findMany({ where: { gamePlayers: { every: { userId: id } } } });
  }

  findGameDetails(gameId: string) { // userId: string,
    // return this.prisma.game.findOne({ where: { gamePlayers: { some: { userId: id } } } });
    return this.prisma.game.findUnique({
      where: { id: gameId },
      select: {
        gameQuestions:
        {
          select:
          {
            answers:
            {
              where:
                { isRight: true },
            },
          },
        },
      },
    });
  }

  findAllWon() {
    return 'This action returns all won games';
  }
}
