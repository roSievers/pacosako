import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001)
export class BoardGateway implements OnGatewayConnection {
  @WebSocketServer() wss;

  private logger = new Logger('AppGateway');

  handleConnection(client) {
    this.logger.log('New client connected.');
    client.emit('connection', 'Successfully connected to server.');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
