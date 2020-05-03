import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaspacienteComponent } from './citaspaciente.component';

describe('CitaspacienteComponent', () => {
  let component: CitaspacienteComponent;
  let fixture: ComponentFixture<CitaspacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaspacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaspacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
