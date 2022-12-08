import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket.module';
import { AppGateway } from './app.gateway';
import { RoomsModule } from './rooms/rooms.module';
import { GamePlayersModule } from './game-players/game-players.module';
import { GameQuestionsModule } from './game-questions/game-questions.module';
import { GameAnswersModule } from './game-answers/game-answers.module';
import { GamePlayerAnswersModule } from './game-player-answers/game-player-answers.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    UsersModule,
    StatsModule,
    GamesModule,
    AuthModule,
    SocketModule,
    RoomsModule,
    GamePlayersModule,
    GameQuestionsModule,
    GameAnswersModule,
    GamePlayerAnswersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule { }
