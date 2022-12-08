import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GamePlayerAnswersService } from './game-player-answers.service';
import { GamePlayerAnswersController } from './game-player-answers.controller';

@Module({
  exports: [GamePlayerAnswersService],
  controllers: [GamePlayerAnswersController],
  providers: [GamePlayerAnswersService, PrismaService],
})
export class GamePlayerAnswersModule { }
