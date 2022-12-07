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

  @UseGuards(JwtAuthGuard)
  @Get('won')
  findAllWon() {
    return this.statsService.findAllWon();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statsService.findOne(+id);
  }
}
