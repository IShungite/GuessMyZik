import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { GamePlayersService } from 'src/game-players/game-players.service';
import { GameQuestionsService } from 'src/game-questions/game-questions.service';
import { GameAnswersService } from 'src/game-answers/game-answers.service';
import { GamePlayerAnswersService } from 'src/game-player-answers/game-player-answers.service';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';

@Module({
  controllers: [GamesController],
  providers: [GamesService,
    GamesGateway,
    PrismaService,
    UsersService,
    GamePlayersService,
    GameQuestionsService,
    GameAnswersService,
    GamePlayerAnswersService,
  ],
  exports: [GamesService],
})
export class GamesModule { }
