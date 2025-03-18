import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInvoiceReportModalComponent } from './final-invoice-report-modal.component';

describe('FinalInvoiceReportModalComponent', () => {
  let component: FinalInvoiceReportModalComponent;
  let fixture: ComponentFixture<FinalInvoiceReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalInvoiceReportModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalInvoiceReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
