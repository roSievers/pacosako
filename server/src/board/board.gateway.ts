import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { inspect } from 'util';
import { Client, Server } from 'socket.io';
import { BoardDto } from '../../../shared/types.dto';
import { PacoBoard } from '../../../shared/types';

@WebSocketGateway(3001)
export class BoardGateway implements OnGatewayConnection {
  @WebSocketServer() wss: Server;

  private logger = new Logger('Websocket Server');

  private fakeDB: Map<string, BoardDto> = new Map();

  handleConnection(client: Client) {
    this.logger.log('New client connected.');
    client.emit('connection', 'Successfully connected to server.');
  }

  @SubscribeMessage('board')
  handleMessage(client: Client, payload: any): string {
    this.logger.log(`Board: ${JSON.stringify(payload)}`);
    this.wss.emit('board', payload);

    if (payload.id && payload.value) {
      this.fakeDB.set(payload.id, payload.value);
    }

    return 'Ok';
  }

  @SubscribeMessage('load-board')
  provideBoard(client: Client, payload: any): string {
    this.logger.log(`Requested state of board '${payload}'`);

    if (payload) {
      if (!this.fakeDB.has(payload)) {
        this.fakeDB.set(payload, new PacoBoard().dto);
      }
      client.emit('board', {
        id: payload,
        value: this.fakeDB.get(payload),
      });
      return 'Ok';
    }
  }
}
