import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMasterModalComponent } from './business-master-modal.component';

describe('BusinessMasterModalComponent', () => {
  let component: BusinessMasterModalComponent;
  let fixture: ComponentFixture<BusinessMasterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessMasterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessMasterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
