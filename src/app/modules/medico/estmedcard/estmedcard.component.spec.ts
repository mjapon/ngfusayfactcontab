import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstmedcardComponent } from './estmedcard.component';

describe('EstmedcardComponent', () => {
  let component: EstmedcardComponent;
  let fixture: ComponentFixture<EstmedcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstmedcardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstmedcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
