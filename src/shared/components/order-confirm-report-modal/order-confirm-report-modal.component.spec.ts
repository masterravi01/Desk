import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmReportModalComponent } from './order-confirm-report-modal.component';

describe('OrderConfirmReportModalComponent', () => {
  let component: OrderConfirmReportModalComponent;
  let fixture: ComponentFixture<OrderConfirmReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmReportModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderConfirmReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
