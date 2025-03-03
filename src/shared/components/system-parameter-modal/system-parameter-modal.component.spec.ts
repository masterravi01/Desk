import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterModalComponent } from './system-parameter-modal.component';

describe('SystemParameterModalComponent', () => {
  let component: SystemParameterModalComponent;
  let fixture: ComponentFixture<SystemParameterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemParameterModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
