import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { BoardGateway } from './board/board.gateway';
import { FrontendMiddleware } from './frontend.middleware';

@Module({
  imports: [],
  controllers: [AppController, BoardController],
  providers: [AppService, BoardService, BoardGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(FrontendMiddleware).forRoutes({
      path: '/**', // for all routes
      method: RequestMethod.ALL,
    });
  }
}
