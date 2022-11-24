import {
  ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GamesService } from './games.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway {
  constructor(private readonly gamesService: GamesService) { }

  @SubscribeMessage('test')
  test(@MessageBody('data') data: string, @ConnectedSocket() client: Socket) {
    console.log('event test: ', data, client.id);
    return 'test';
  }
}
