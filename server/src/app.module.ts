import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';

@Module({
  imports: [],
  controllers: [AppController, BoardController],
  providers: [AppService, BoardService],
})
export class AppModule {}
