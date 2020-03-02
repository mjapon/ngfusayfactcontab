import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadcomponentComponent } from './loadcomponent.component';

describe('LoadcomponentComponent', () => {
  let component: LoadcomponentComponent;
  let fixture: ComponentFixture<LoadcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
