import { Injectable } from '@nestjs/common';
import { GameAnswer } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) { }

  findAllPlayed(id: string) {
    return this.prisma.game.findMany({
      where: {
        gamePlayers: {
          some: { userId: id },
        },
        state: 'FINISHED',
      },
      include: {
        gamePlayers: {
          orderBy: { score: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findGameDetails(gameId: string, playerId: string) { // userId: string,
    const gameAnswers: GameAnswer[] = [];
    const playerAnswers: GameAnswer[] = [];

    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        gameQuestions:
        {
          include:
          {
            answers:
            {
              where: { isRight: true },
            },
          },
        },
      },
    });

    game.gameQuestions.forEach((question) => {
      question.answers.forEach((answer) => {
        gameAnswers.push(answer);
      });
    });

    const gamePlayerAnswers = await this.prisma.gamePlayer.findFirst({
      where: {
        userId: playerId,
        gameId,
      },
      select: {
        gamePlayerAnswers: {
          select: {
            gameAnswer: {
              select: {
                id: true, value: true, isRight: true, questionId: true,
              },
            },
          },
        },
      },
    });

    gamePlayerAnswers.gamePlayerAnswers.forEach((item) => {
      playerAnswers.push(item.gameAnswer);
    });

    return { gameAnswers, playerAnswers };
  }
}
