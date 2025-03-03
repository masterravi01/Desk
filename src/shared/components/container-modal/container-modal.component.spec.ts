import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerModalComponent } from './container-modal.component';

describe('ContainerModalComponent', () => {
  let component: ContainerModalComponent;
  let fixture: ComponentFixture<ContainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
