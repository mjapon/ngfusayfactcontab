import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaformComponent } from './personaform.component';

describe('PersonaformComponent', () => {
  let component: PersonaformComponent;
  let fixture: ComponentFixture<PersonaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
