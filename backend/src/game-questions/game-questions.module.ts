import { Module } from '@nestjs/common';
import { GameQuestionsService } from './game-questions.service';
import { GameQuestionsController } from './game-questions.controller';

@Module({
  controllers: [GameQuestionsController],
  providers: [GameQuestionsService]
})
export class GameQuestionsModule {}
