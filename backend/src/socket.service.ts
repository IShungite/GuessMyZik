import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  public socket: Server = null;

  public setSocket(socket: Server): void {
    this.socket = socket;
  }
}
