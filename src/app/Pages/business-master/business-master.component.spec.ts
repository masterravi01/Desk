import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMasterComponent } from './business-master.component';

describe('BusinessMasterComponent', () => {
  let component: BusinessMasterComponent;
  let fixture: ComponentFixture<BusinessMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
