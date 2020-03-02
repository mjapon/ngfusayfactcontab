import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Congreso2020Component } from './congreso2020.component';

describe('Congreso2020Component', () => {
  let component: Congreso2020Component;
  let fixture: ComponentFixture<Congreso2020Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Congreso2020Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Congreso2020Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
