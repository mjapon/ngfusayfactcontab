import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketformComponent } from './ticketform.component';

describe('TicketformComponent', () => {
  let component: TicketformComponent;
  let fixture: ComponentFixture<TicketformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
