import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusaynavbarComponent } from './fusaynavbar.component';

describe('FusaynavbarComponent', () => {
  let component: FusaynavbarComponent;
  let fixture: ComponentFixture<FusaynavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusaynavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusaynavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
