import { Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GamesService } from 'src/games/games.service';
import { PrismaService } from 'src/prisma.service';
import getSocketGameRoom from 'src/utils/getSocketGameRoom';
import { RoomsService } from './rooms.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly gamesService: GamesService,
    private readonly prismaService: PrismaService,
  ) { }

  private logger: Logger = new Logger('RoomsGateway');

  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() { joinCode, userId }: { joinCode: string, userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`client ${client.id} with userId ${userId} joining the room ${joinCode}`);

    const socketRooms = Array.from(client.rooms.values()).filter((room) => room !== client.id);

    if (socketRooms.length > 0) {
      client.emit('join_error', { error: 'You are already in a room' });
      throw new UnauthorizedException('You are already in a room');
    }

    const gameExists = await this.prismaService.game.findFirst({ where: { joinCode, state: 'WAITING' } });

    if (!gameExists) {
      client.emit('join_error', { error: 'Game not found' });
      throw new NotFoundException('Game not found');
    }

    const userExists = await this.prismaService.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      client.emit('join_error', { error: 'User not found' });
      throw new NotFoundException('User not found');
    }

    const previousGamePlayers = await this.prismaService.gamePlayer.findMany(
      { where: { gameId: gameExists.id }, select: { id: true, userId: true, user: { select: { username: true } } } },
    );

    const userHasAlreadyJoined = previousGamePlayers.find((gamePlayer) => gamePlayer.userId === userId);

    const newGamePlayer = userHasAlreadyJoined
      ? await this.prismaService.gamePlayer.update({
        where: { id: userHasAlreadyJoined.id },
        data: { socketId: client.id, isConnected: true },
      })
      : await this.prismaService.gamePlayer.create({
        data: {
          gameId: gameExists.id,
          userId: userExists.id,
          socketId: client.id,
          isConnected: true,
          isOwner: previousGamePlayers.length === 0,
        },
      });

    await client.join(joinCode);

    const previousGamePlayersFormat = previousGamePlayers.map((gp) => ({ id: gp.id, username: gp.user.username }));
    const newGamePlayerFormat = { id: newGamePlayer.id, username: userExists.username };

    client.emit('join_success', {
      game: {
        ...gameExists,
        gamePlayers: userHasAlreadyJoined
          ? previousGamePlayersFormat : [...previousGamePlayersFormat, newGamePlayerFormat],
      },
    });

    client.to(joinCode).emit('on_join_room', { gamePlayer: newGamePlayerFormat });

    this.logger.log(`client ${client.id} with userId ${userId} has successfully joined the room ${joinCode}`);
  }

  @SubscribeMessage('leave_room')
  async leaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() { userId }: { userId: string },
  ) {
    const gameRoom = getSocketGameRoom(client);

    this.logger.log(`client ${client.id} leaving from the room ${gameRoom}`);

    const gamePlayer = await this.prismaService.gamePlayer.findFirst({
      where: { game: { joinCode: gameRoom }, userId },
    });

    await this.prismaService.gamePlayer.update({
      where: { id: gamePlayer.id },
      data: {
        isConnected: false,
      },
    });

    this.logger.log(`user ${gamePlayer.userId} leaving from the room ${gameRoom}`);

    await client.leave(gameRoom);

    client.to(gameRoom).emit('on_leave_room', { gamePlayerId: gamePlayer.id });

    const gameEngine = await this.gamesService.getGameEngine(gameRoom);
    await gameEngine.updateGameState();
  }
}
