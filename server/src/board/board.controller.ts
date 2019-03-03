import { Controller, Get, Param } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get(':id')
  findOne(@Param() params) {
    console.log(params);
    return this.boardService.get(params.id);
  }
  @Get(':id/:value')
  setOne(@Param() params) {
    console.log(params);
    this.boardService.set(params.id, params.value);
    return `Stored ${params.value} for ${params.id}.`;
  }
}
