import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusayfooterComponent } from './fusayfooter.component';

describe('FusayfooterComponent', () => {
  let component: FusayfooterComponent;
  let fixture: ComponentFixture<FusayfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusayfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusayfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
