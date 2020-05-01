import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscitasComponent } from './miscitas.component';

describe('MiscitasComponent', () => {
  let component: MiscitasComponent;
  let fixture: ComponentFixture<MiscitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
