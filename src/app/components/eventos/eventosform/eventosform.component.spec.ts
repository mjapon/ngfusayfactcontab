import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosformComponent } from './eventosform.component';

describe('EventosformComponent', () => {
  let component: EventosformComponent;
  let fixture: ComponentFixture<EventosformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
