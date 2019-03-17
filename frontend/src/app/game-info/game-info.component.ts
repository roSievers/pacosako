import { Component, OnInit, Input } from '@angular/core';
import { IBoardProvider } from '../interfaces';
import { PacoBoard } from '../../../../shared/types';
import { PlayerColor } from '../../../../shared/interfaces';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css'],
})
export class GameInfoComponent implements OnInit {
  @Input() handler?: IBoardProvider;
  private board?: PacoBoard;

  constructor() {}

  ngOnInit() {
    this.handler.board.subscribe(newBoard => (this.board = newBoard));
  }

  get currentPlayer(): string {
    if (this.board.currentPlayer == PlayerColor.white) {
      return 'White';
    } else {
      return 'Black';
    }
  }
}
