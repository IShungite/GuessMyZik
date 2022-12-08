import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GamePlayerAnswersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createGamePlayerAnswer: Prisma.GamePlayerAnswerUncheckedCreateInput) {
    return this.prismaService.gamePlayerAnswer.create({
      data: createGamePlayerAnswer,
    });
  }

  async findOneOrThrow(findGamePlayerAnswer: Prisma.GamePlayerAnswerFindFirstOrThrowArgs) {
    return this.prismaService.gamePlayerAnswer.findFirstOrThrow(findGamePlayerAnswer);
  }

  async findOne(findGameAnswer: Prisma.GamePlayerAnswerFindFirstArgs) {
    return this.prismaService.gamePlayerAnswer.findFirst(findGameAnswer);
  }

  async findMany(findGamePlayerAnswersDto: Prisma.GamePlayerAnswerFindManyArgs) {
    return this.prismaService.gamePlayerAnswer.findMany(findGamePlayerAnswersDto);
  }
}
