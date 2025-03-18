import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInvoiceModalComponent } from './confirm-invoice-modal.component';

describe('ConfirmInvoiceModalComponent', () => {
  let component: ConfirmInvoiceModalComponent;
  let fixture: ComponentFixture<ConfirmInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmInvoiceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
