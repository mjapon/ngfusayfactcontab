import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferentesFormComponent } from './referentes-form.component';

describe('ReferentesFormComponent', () => {
  let component: ReferentesFormComponent;
  let fixture: ComponentFixture<ReferentesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferentesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferentesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
