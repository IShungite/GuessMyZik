import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket.module';
import { AppGateway } from './app.gateway';
import { RoomsModule } from './rooms/rooms.module';
import { DeezerService } from './deezer/deezer.service';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [UsersModule, GamesModule, AuthModule, SocketModule, RoomsModule, StatsModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, DeezerService],
})
export class AppModule { }
