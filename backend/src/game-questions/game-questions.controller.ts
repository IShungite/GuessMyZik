import { Controller } from '@nestjs/common';
import { GameQuestionsService } from './game-questions.service';

@Controller('game-questions')
export class GameQuestionsController {
  constructor(private readonly gameQuestionsService: GameQuestionsService) {}
}
