import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GamePlayersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async findOneOrThrow(findGamePlayerDto: Prisma.GamePlayerFindFirstOrThrowArgs) {
    return this.prismaService.gamePlayer.findFirstOrThrow(findGamePlayerDto);
  }

  async update(updateGamePlayerDto: Prisma.GamePlayerUpdateArgs) {
    return this.prismaService.gamePlayer.update(updateGamePlayerDto);
  }

  async findMany(findGamePlayersDto: Prisma.GamePlayerFindManyArgs) {
    return this.prismaService.gamePlayer.findMany(findGamePlayersDto);
  }
}
