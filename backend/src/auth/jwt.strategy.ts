import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './auth.const';
import { IAuthPayload, IUserRequest } from './auth.models';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: IAuthPayload): Promise<IUserRequest> {
    // If we need to send more data to the client:
    // const user = await this.usersService.findOne({ id: payload.sub });
    return { id: payload.sub, username: payload.username };
  }
}
