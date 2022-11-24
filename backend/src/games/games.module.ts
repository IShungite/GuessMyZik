import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GamesGateway, PrismaService],
})
export class GamesModule { }
