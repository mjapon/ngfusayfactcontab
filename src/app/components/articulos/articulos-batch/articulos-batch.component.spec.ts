import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosBatchComponent } from './articulos-batch.component';

describe('ArticulosBatchComponent', () => {
  let component: ArticulosBatchComponent;
  let fixture: ComponentFixture<ArticulosBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticulosBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticulosBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
