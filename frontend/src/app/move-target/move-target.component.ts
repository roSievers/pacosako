import { Component, OnInit, Input } from '@angular/core';
import { Position, PacoMoveType } from '../types';

@Component({
  selector: 'app-move-target',
  templateUrl: './move-target.component.html',
  styleUrls: ['./move-target.component.css'],
})
export class MoveTargetComponent implements OnInit {
  @Input() position: Position;
  @Input() clickHandler?: (position: Position) => void;
  @Input() moveType?: PacoMoveType;

  constructor() {}

  ngOnInit() {}

  get transform(): string {
    return `translate(${100 * this.position.x}px, ${100 *
      (7 - this.position.y)}px)`;
  }

  get cssClasses(): string {
    return `legalMove ${this.moveTypeClass}`;
  }

  get moveTypeClass(): string {
    switch (this.moveType) {
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
    if (this.clickHandler !== null) {
      this.clickHandler(this.position);
    }
  }
}
