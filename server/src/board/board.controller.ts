import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get(':id')
  findOne(@Param() params: any) {
    console.log(params);
    return this.boardService.get(params.id);
  }
  @Get(':id/:value')
  setOne(@Param() params: any) {
    console.log(params);
    this.boardService.set(params.id, params.value);
    return `Stored ${params.value} for ${params.id}.`;
  }
  @Post()
  storeBoard(@Body() board: any) {
    console.log(`Posted to /board with data=${JSON.stringify(board)}`);
    this.boardService.board = JSON.stringify(board);
  }
  @Get()
  loadBoard() {
    let board = this.boardService.board;
    console.log(`Loading from /board with data=${board}`);
    return board;
  }
}
