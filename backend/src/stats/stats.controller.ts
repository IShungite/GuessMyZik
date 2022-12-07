import {
  Controller, Get, Param, UseGuards, Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('played')
  findAllPlayed(@Request() req) {
    return this.statsService.findAllPlayed(req.user.id);
  }

  // @UseGuards(JwtAuthGuard)
  // findGameDetails(@Request() req, @Param() gameId: string) {
  //   return this.statsService.findGameDetails(req.user.id, gameId);
  // }
  @Get('details/:gameId')
  findGameDetails(@Param('gameId') gameId: string) {
    return this.statsService.findGameDetails(gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('won')
  findAllWon() {
    return this.statsService.findAllWon();
  }
}
