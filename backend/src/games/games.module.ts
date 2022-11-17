import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  controllers: [GamesController],
  providers: [GamesService, PrismaService],
})
export class GamesModule { }
