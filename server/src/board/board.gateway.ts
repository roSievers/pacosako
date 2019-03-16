import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { inspect } from 'util';
import { Client, Server } from 'socket.io';

@WebSocketGateway(3001)
export class BoardGateway implements OnGatewayConnection {
  @WebSocketServer() wss: Server;

  private logger = new Logger('Websocket Server');

  handleConnection(client: Client) {
    this.logger.log('New client connected.');
    client.emit('connection', 'Successfully connected to server.');
  }

  @SubscribeMessage('board')
  handleMessage(client: Client, payload: any): string {
    this.logger.log(`Board: ${JSON.stringify(payload)}`);
    this.wss.emit('board', payload);
    return 'Ok';
  }
}
