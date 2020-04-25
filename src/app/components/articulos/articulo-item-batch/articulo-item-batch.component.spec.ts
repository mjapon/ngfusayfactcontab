import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloItemBatchComponent } from './articulo-item-batch.component';

describe('ArticuloItemBatchComponent', () => {
  let component: ArticuloItemBatchComponent;
  let fixture: ComponentFixture<ArticuloItemBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticuloItemBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticuloItemBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
