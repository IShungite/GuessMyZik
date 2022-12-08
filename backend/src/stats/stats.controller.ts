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

  @Get('details/:gameId/:playerId')
  findGameDetails(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return this.statsService.findGameDetails(gameId, playerId);
  }
}
