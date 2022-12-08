import { Controller } from '@nestjs/common';
import { GamePlayerAnswersService } from './game-player-answers.service';

@Controller('game-player-answers')
export class GamePlayerAnswersController {
  constructor(private readonly gamePlayerAnswersService: GamePlayerAnswersService) {}
}
