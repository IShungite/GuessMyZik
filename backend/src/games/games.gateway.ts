/* eslint-disable @typescript-eslint/indent */
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { GameState, Prisma } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';
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
    private readonly prismaService: PrismaService,
  ) { }

  private logger: Logger = new Logger('GamesGateway');

  @SubscribeMessage('update_game')
  async updateGame(
    @MessageBody() { updateGameDto }: { updateGameDto: Prisma.GameUpdateInput },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`${client.id} - event update_game`);

    const gameRoom = getSocketGameRoom(client);
    const gameEngine = await this.gamesService.getGameEngine(gameRoom);

    await gameEngine.updateGameParameters(updateGameDto, client);
  }

  @SubscribeMessage('start_game')
  async startGame(
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`${client.id} - event start_game`);

    const gameRoom = getSocketGameRoom(client);
    const gameEngine = await this.gamesService.getGameEngine(gameRoom);

    await gameEngine.gameStart();
  }

  @SubscribeMessage('next_song')
  async nextSong(
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`${client.id} - event next_song`);

    const gameRoom = getSocketGameRoom(client);
    const gameEngine = await this.gamesService.getGameEngine(gameRoom);

    await gameEngine.nextSong();
  }

  @SubscribeMessage('send_answer')
  async sendAnswer(
    @MessageBody() { answer }: { answer: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`${client.id} - event send_answer`);

    const gameRoom = getSocketGameRoom(client);

    const game = await this.prismaService.game.findFirstOrThrow(
      { where: { joinCode: gameRoom, state: GameState.PLAYING } },
    );

    await this.gamesService.sendAnswer(game.id, client.id, answer);

    client.to(gameRoom).emit('on_answer_sent');

    await this.gamesService.UpdateGameState(game.id);
  }
}
