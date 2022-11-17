import {
  Controller, Get, Post, Body, Patch, Param, Delete,
} from '@nestjs/common';
import {
  Game, GamePlayer, Prisma,
} from '@prisma/client';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Post()
  create(): Promise<{ game: Game, gamePlayer: GamePlayer }> {
    return this.gamesService.create();
  }

  @Get('/removeall') // TODO REMOVE THIS ENDPOINT
  removeAll() {
    return this.gamesService.removeAll();
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: Prisma.GameUpdateInput) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
