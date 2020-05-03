import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginpacienteComponent } from './loginpaciente.component';

describe('LoginpacienteComponent', () => {
  let component: LoginpacienteComponent;
  let fixture: ComponentFixture<LoginpacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginpacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginpacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
