import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplirAccountsPayableListComponent } from './supplir-accounts-payable-list.component';

describe('SupplirAccountsPayableListComponent', () => {
  let component: SupplirAccountsPayableListComponent;
  let fixture: ComponentFixture<SupplirAccountsPayableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplirAccountsPayableListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplirAccountsPayableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
