import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInvoiceComponent } from './select-invoice.component';

describe('SelectInvoiceComponent', () => {
  let component: SelectInvoiceComponent;
  let fixture: ComponentFixture<SelectInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
