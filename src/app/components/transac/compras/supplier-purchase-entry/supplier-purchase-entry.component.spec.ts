import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPurchaseEntryComponent } from './supplier-purchase-entry.component';

describe('SupplierPurchaseEntryComponent', () => {
  let component: SupplierPurchaseEntryComponent;
  let fixture: ComponentFixture<SupplierPurchaseEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPurchaseEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierPurchaseEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
