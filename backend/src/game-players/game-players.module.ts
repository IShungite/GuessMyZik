import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GamePlayersService } from './game-players.service';
import { GamePlayersController } from './game-players.controller';

@Module({
  exports: [GamePlayersService],
  controllers: [GamePlayersController],
  providers: [GamePlayersService, PrismaService],
})
export class GamePlayersModule { }
