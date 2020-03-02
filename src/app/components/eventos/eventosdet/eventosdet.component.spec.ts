import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosdetComponent } from './eventosdet.component';

describe('EventosdetComponent', () => {
  let component: EventosdetComponent;
  let fixture: ComponentFixture<EventosdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
