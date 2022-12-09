import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GamesService } from 'src/games/games.service';
import { GamePlayersService } from 'src/game-players/game-players.service';
import { GameQuestionsService } from 'src/game-questions/game-questions.service';
import { GamePlayerAnswersService } from 'src/game-player-answers/game-player-answers.service';
import { GameAnswersService } from 'src/game-answers/game-answers.service';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsGateway,
    RoomsService,
    PrismaService,
    GamesService,
    GamePlayersService,
    GameQuestionsService,
    GamePlayerAnswersService,
    GameAnswersService,
  ],
})
export class RoomsModule { }
