import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggednavbarComponent } from './loggednavbar.component';

describe('LoggednavbarComponent', () => {
  let component: LoggednavbarComponent;
  let fixture: ComponentFixture<LoggednavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggednavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggednavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
