import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) { }

  findAllPlayed(id: string) {
    return this.prisma.game.findMany({ where: { gamePlayers: { some: { userId: id } } } });
  }

  findAllWon() {
    return 'This action returns all won games';
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }
}
