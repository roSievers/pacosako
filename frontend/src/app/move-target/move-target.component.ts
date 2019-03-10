import { Component, OnInit, Input } from '@angular/core';
import { Position, PacoMoveType, MoveTarget } from '../types';

@Component({
  selector: 'app-move-target',
  templateUrl: './move-target.component.html',
  styleUrls: ['./move-target.component.css'],
})
export class MoveTargetComponent implements OnInit {
  @Input() target: MoveTarget;
  @Input() clickHandler?: (position: Position) => void;

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
    if (this.clickHandler !== null) {
      this.clickHandler(this.target.position);
    }
  }
}
