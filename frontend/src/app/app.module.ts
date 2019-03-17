import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { LogComponent } from './log/log.component';
import { PieceComponent } from './piece/piece.component';
import { MoveTargetComponent } from './move-target/move-target.component';
import { HomeComponent } from './home/home.component';
import { GameViewComponent } from './game-view/game-view.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    LogComponent,
    PieceComponent,
    MoveTargetComponent,
    HomeComponent,
    GameViewComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
