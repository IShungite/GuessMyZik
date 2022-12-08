import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GameQuestionsService } from './game-questions.service';
import { GameQuestionsController } from './game-questions.controller';

@Module({
  exports: [GameQuestionsService],
  controllers: [GameQuestionsController],
  providers: [GameQuestionsService, PrismaService],
})
export class GameQuestionsModule { }
