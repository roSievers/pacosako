import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  test(@Res() res) {
    console.log('loading index.html');
    let indexPath = 'index.html';
    return res.sendFile(indexPath, {
      root: path.resolve(__dirname + '/../dist'),
    });
  }
}
