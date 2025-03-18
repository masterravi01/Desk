import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmReportComponent } from './order-confirm-report.component';

describe('OrderConfirmReportComponent', () => {
  let component: OrderConfirmReportComponent;
  let fixture: ComponentFixture<OrderConfirmReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderConfirmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
