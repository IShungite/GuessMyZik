import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GameQuestionsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createGameQuestionDto: Prisma.GameQuestionUncheckedCreateInput) {
    return this.prismaService.gameQuestion.create({
      data: createGameQuestionDto,
    });
  }

  async findByGameIdAndQuestionNumber(gameId: string, questionNumber: number) {
    return this.prismaService.gameQuestion.findFirstOrThrow({
      where: {
        gameId,
        number: questionNumber,
      },
    });
  }
}
