import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger.service';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnInit {
  private boardId: Subject<string> = new ReplaySubject();

  constructor(private log: LoggerService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const id: string = paramMap.get('id');
      this.log.add(`Current board identifier is: ${id}`);
      this.boardId.next(id);
    });
  }
}
