import { Logger, NotFoundException } from '@nestjs/common';
import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
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

    const gameExists = await this.prismaService.game.findFirst({ where: { joinCode: gameRoom, state: 'WAITING' } });

    if (!gameExists) {
      throw new NotFoundException('Game not found');
    }

    await this.gamesService.update(gameExists.id, updateGameDto);

    client.to(gameRoom).emit('on_game_update', { updateGameDto });
  }
}
