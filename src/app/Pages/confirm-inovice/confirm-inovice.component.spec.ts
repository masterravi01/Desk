import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInoviceComponent } from './confirm-inovice.component';

describe('ConfirmInoviceComponent', () => {
  let component: ConfirmInoviceComponent;
  let fixture: ComponentFixture<ConfirmInoviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmInoviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmInoviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
