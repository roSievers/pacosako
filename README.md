# Paco Ŝako

An implementation of the game [Paco Ŝako](https://pacosako.com/) as a web app.

![A screenshot of the game during play.](https://raw.githubusercontent.com/roSievers/pacosako/angular-frontend/screenshot.png)

## Development

The frontend is written in [Typescript](http://typescriptlang.org/)
using [Angular](https://angular.io/)
Run `ng build --output-path="../dist" --watch` in the frontend folder
to build the frontend and provide the distribution to the server.

The server is also written in Typescript using [NestJS](http://nestjs.com/) as
server framework. Run `npm run start:dev` in the `/server` folder in order to start
a NestJS development server.
