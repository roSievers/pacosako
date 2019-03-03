import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve the folder '/dist' at '/dist'.
  app.use('/assets', express.static(path.resolve(__dirname + '/../dist')));

  await app.listen(3000);
}
bootstrap();
