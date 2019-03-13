import { Component, OnInit, Input } from '@angular/core';
import { MoveTarget } from '../types';
import { BoardComponent } from '../board/board.component';
import { PacoMoveType } from '../interfaces';

@Component({
  selector: 'app-move-target',
  templateUrl: './move-target.component.html',
  styleUrls: ['./move-target.component.css'],
})
export class MoveTargetComponent implements OnInit {
  @Input() target: MoveTarget;
  @Input() handler?: BoardComponent;

  constructor() {}

  ngOnInit() {}

  get transform(): string {
    return `translate(${100 * this.target.position.x}px, ${100 *
      (7 - this.target.position.y)}px)`;
  }

  get cssClasses(): string {
    return `legalMove ${this.moveTypeClass}`;
  }

  get moveTypeClass(): string {
    switch (this.target.type) {
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
    if (this.handler !== null) {
      this.handler.onMoveTargetClick(this.target);
    }
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drop(event) {
    event.preventDefault();
    if (this.handler !== null) {
      this.handler.onPieceDrop(this.target);
    }
  }
}
