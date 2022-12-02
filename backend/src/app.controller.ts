import {
  Controller, Get, Post, UseGuards, Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IUserRequest } from './auth/auth.models';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
import { DeezerService } from './deezer/deezer.service';
import { SocketService } from './socket.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private socketService: SocketService,
    private deezerService: DeezerService,
  ) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getHello(@GetUser() user: IUserRequest) {
    const playlist = await this.deezerService.getRandomPlaylist();

    return this.appService.getHello();
  }
}
