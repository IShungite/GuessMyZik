import { Module } from '@nestjs/common';
import { GameAnswersService } from './game-answers.service';
import { GameAnswersController } from './game-answers.controller';

@Module({
  controllers: [GameAnswersController],
  providers: [GameAnswersService]
})
export class GameAnswersModule {}
