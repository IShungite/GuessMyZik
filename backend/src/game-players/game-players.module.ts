import { Module } from '@nestjs/common';
import { GamePlayersService } from './game-players.service';
import { GamePlayersController } from './game-players.controller';

@Module({
  controllers: [GamePlayersController],
  providers: [GamePlayersService]
})
export class GamePlayersModule {}
