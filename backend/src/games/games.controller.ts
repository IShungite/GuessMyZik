import {
  Controller, Get, Post, Body, Patch, Param, Delete,
} from '@nestjs/common';
import {
  Game, Prisma,
} from '@prisma/client';
import { SocketService } from 'src/socket.service';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService, private socketService: SocketService) { }

  @Post()
  create(): Promise<Game> {
    return this.gamesService.create();
  }

  @Get('/removeall') // TODO REMOVE THIS ENDPOINT
  removeAll() {
    return this.gamesService.removeAll();
  }

  @Get('join/:joinCode')
  findByJoinCode(@Param('joinCode') joinCode: string) {
    return this.gamesService.findFirst({ joinCode, state: 'WAITING' });
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGameDto: Prisma.GameUpdateInput) {
    const gameUpdated = await this.gamesService.update(id, updateGameDto);

    this.socketService.socket.to(gameUpdated.joinCode).emit('game-update', gameUpdated);

    return gameUpdated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const gameDeleted = await this.gamesService.remove(id);

    this.socketService.socket.to(gameDeleted.joinCode).emit('game-delete');

    return gameDeleted;
  }
}
