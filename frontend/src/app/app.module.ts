import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BoardComponent } from "./board/board.component";
import { LogComponent } from "./log/log.component";
import { ButtonsComponent } from "./buttons/buttons.component";
import { PieceComponent } from "./piece/piece.component";
import { LoggerService } from "./logger.service";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    LogComponent,
    ButtonsComponent,
    PieceComponent
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
