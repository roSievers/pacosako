import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import * as path from 'path';

const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg'];

const resolvePath = (file: string) =>
  path.resolve(__dirname + `../../../dist/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      const { baseUrl } = req;
      console.log(`Middleware was called with url = ${baseUrl}`);
      if (baseUrl.indexOf('api') === 1) {
        // it starts with /api --> continue with execution
        next();
      } else if (
        allowedExt.filter(ext => baseUrl.indexOf(ext) > 0).length > 0
      ) {
        // it has a file extension --> resolve the file
        res.sendFile(resolvePath(baseUrl));
      } else {
        // in all other cases, redirect to the index.html!
        res.sendFile(resolvePath('index.html'));
      }
    };
  }
}
