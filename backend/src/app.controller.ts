import {
  Controller, Get, Post, UseGuards, Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IUserRequest } from './auth/auth.models';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
import { SocketService } from './socket.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private socketService: SocketService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@GetUser() user: IUserRequest) {
    console.log(user);
    this.socketService.socket.emit('hello', 'Hello world!');
    return 'Hello World!';
  }
}
