import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GameAnswersService } from './game-answers.service';
import { GameAnswersController } from './game-answers.controller';

@Module({
  exports: [GameAnswersService],
  controllers: [GameAnswersController],
  providers: [GameAnswersService, PrismaService],
})
export class GameAnswersModule { }
