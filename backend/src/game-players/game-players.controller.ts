import { Controller } from '@nestjs/common';
import { GamePlayersService } from './game-players.service';

@Controller('game-players')
export class GamePlayersController {
  constructor(private readonly gamePlayersService: GamePlayersService) {}
}
