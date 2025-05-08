import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasmedComponent } from './estadisticasmed.component';

describe('EstadisticasmedComponent', () => {
  let component: EstadisticasmedComponent;
  let fixture: ComponentFixture<EstadisticasmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasmedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadisticasmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
