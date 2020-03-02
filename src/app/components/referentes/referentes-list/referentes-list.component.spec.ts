import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferentesListComponent } from './referentes-list.component';

describe('ReferentesListComponent', () => {
  let component: ReferentesListComponent;
  let fixture: ComponentFixture<ReferentesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferentesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferentesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
