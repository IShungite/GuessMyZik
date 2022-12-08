import { Controller } from '@nestjs/common';
import { GameAnswersService } from './game-answers.service';

@Controller('game-answers')
export class GameAnswersController {
  constructor(private readonly gameAnswersService: GameAnswersService) {}
}
