import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { BoardService } from '../board.service';
import { IBoardProvider } from '../interfaces';
import { PacoBoard } from '../../../../shared/types';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnInit, IBoardProvider {
  boardId?: string;
  private subscription?: Subscription;
  board: Subject<PacoBoard> = new ReplaySubject();

  constructor(
    private log: LoggerService,
    public boardService: BoardService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const id: string = paramMap.get('id');

      this.newBoardId(id);
    });
  }

  private newBoardId(id: string) {
    this.log.add(`Set board identifier to '${id}'`);
    this.boardId = id;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.boardService.getBoard(id).subscribe(boardDto => {
      this.board.next(PacoBoard.fromData(boardDto));
    });
  }

  public storeBoard(board: PacoBoard): void {
    this.boardService.setBoardFromUi(this.boardId, board.dto);
  }
}
