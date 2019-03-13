import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { LogComponent } from './log/log.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { PieceComponent } from './piece/piece.component';
import { MoveTargetComponent } from './move-target/move-target.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    LogComponent,
    ButtonsComponent,
    PieceComponent,
    MoveTargetComponent,
    HomeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
