import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInvoiceReportComponent } from './final-invoice-report.component';

describe('FinalInvoiceReportComponent', () => {
  let component: FinalInvoiceReportComponent;
  let fixture: ComponentFixture<FinalInvoiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalInvoiceReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
