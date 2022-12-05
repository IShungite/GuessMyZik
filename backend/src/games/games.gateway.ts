/* eslint-disable @typescript-eslint/indent */
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { GameState, Prisma } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';
import { SocketService } from 'src/socket.service';
import { UsersService } from 'src/users/users.service';
import getSocketGameRoom from 'src/utils/getSocketGameRoom';
import { GamesService } from './games.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway {
  constructor(
    private readonly gamesService: GamesService,
    private readonly socketService: SocketService,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) { }

  private logger: Logger = new Logger('GamesGateway');

  @SubscribeMessage('update_game')
  async updateGame(
    @MessageBody() { updateGameDto }: { updateGameDto: Prisma.GameUpdateInput },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Client ${client.id} updating the game`, JSON.stringify(updateGameDto));

    const gameRoom = getSocketGameRoom(client);

    const game = await this.prismaService.game.findFirstOrThrow({ where: { joinCode: gameRoom, state: 'WAITING' } });

    await this.gamesService.update(game.id, updateGameDto);

    this.logger.log(`Client ${client.id} successfully updated the game`);

    client.to(gameRoom).emit('on_game_update', { updateGameDto });
  }

  @SubscribeMessage('start_game')
  async startGame(
    @ConnectedSocket() client: Socket,
  ) {
    const gameRoom = getSocketGameRoom(client);

    const game = await this.gamesService.startGame(gameRoom);

    this.socketService.socket.to(gameRoom).emit('on_game_start', { game });

    await this.nextSong(client);
  }

  @SubscribeMessage('next_song')
  async nextSong(
    @ConnectedSocket() client: Socket,
  ) {
    const gameRoom = getSocketGameRoom(client);

    const { track, gameAnswers, game } = await this.gamesService.nextSong(gameRoom);

    this.socketService.socket.to(gameRoom).emit('on_next_song', { trackPreview: track.preview, gameAnswers });
    this.gamesService.startTimer(gameRoom, game.id);
  }

  @SubscribeMessage('send_answer')
  async sendAnswer(
    @MessageBody() { answer }: { answer: string },
    @ConnectedSocket() client: Socket,
  ) {
    const gameRoom = getSocketGameRoom(client);

    const game = await this.prismaService.game.findFirstOrThrow(
      { where: { joinCode: gameRoom, state: GameState.PLAYING } },
    );

    await this.gamesService.sendAnswer(game.id, client.id, answer);

    client.to(gameRoom).emit('on_answer_sent');

    await this.gamesService.UpdateGameState(game.id);
  }
}
