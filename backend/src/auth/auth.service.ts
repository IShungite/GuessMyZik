import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { IAuthLoginResponse, JWtPayload } from './auth.models';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<JWtPayload> {
    const user = await this.usersService.findOne({ username });
    if (!user) return null;

    const isSamePassword = await compare(pass, user.password);
    if (!isSamePassword) return null;

    return { username, id: user.id };
  }

  async login(userPayload: JWtPayload): Promise<IAuthLoginResponse> {
    const payload = { username: userPayload.username, sub: userPayload.id };
    return {
      id: userPayload.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
