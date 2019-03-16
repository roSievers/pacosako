import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTargetComponent } from './move-target.component';

describe('MoveTargetComponent', () => {
  let component: MoveTargetComponent;
  let fixture: ComponentFixture<MoveTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
