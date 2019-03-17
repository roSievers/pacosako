import { Component, OnInit, Input } from '@angular/core';
import { Move } from '../../../../shared/types';
import { BoardComponent } from '../board/board.component';
import { PacoMoveType } from '../../../../shared/interfaces';

@Component({
  selector: 'app-move-target',
  templateUrl: './move-target.component.html',
  styleUrls: ['./move-target.component.css'],
})
export class MoveTargetComponent implements OnInit {
  @Input() move: Move;
  @Input() handler?: BoardComponent;

  constructor() {}

  ngOnInit() {}

  get transform(): string {
    return `translate(${100 * this.move.target.x}px, ${100 *
      (7 - this.move.target.y)}px)`;
  }

  get cssClasses(): string {
    return `legalMove ${this.moveTypeClass}`;
  }

  get moveTypeClass(): string {
    switch (this.move.type) {
      case PacoMoveType.chain:
        return 'chain';
      case PacoMoveType.union:
        return 'union';
      default:
        return 'plain';
    }
  }

  onClick(clickEvent: any) {
    clickEvent.stopPropagation();
    if (this.handler !== undefined) {
      this.handler.onMoveTargetClick(this.move);
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  drop(event: any) {
    event.preventDefault();
    if (this.handler !== undefined) {
      this.handler.onPieceDrop(this.move);
    }
  }
}
