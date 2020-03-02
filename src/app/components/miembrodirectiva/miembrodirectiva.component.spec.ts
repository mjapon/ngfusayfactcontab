import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrodirectivaComponent } from './miembrodirectiva.component';

describe('MiembrodirectivaComponent', () => {
  let component: MiembrodirectivaComponent;
  let fixture: ComponentFixture<MiembrodirectivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiembrodirectivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiembrodirectivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
