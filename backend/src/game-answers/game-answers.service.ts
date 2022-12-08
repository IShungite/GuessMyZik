import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GameAnswersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createGameAnswerDto: Prisma.GameAnswerUncheckedCreateInput) {
    return this.prismaService.gameAnswer.create({
      data: createGameAnswerDto,
    });
  }
}
