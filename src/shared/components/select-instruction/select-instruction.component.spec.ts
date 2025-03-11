import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInstructionComponent } from './select-instruction.component';

describe('SelectInstructionComponent', () => {
  let component: SelectInstructionComponent;
  let fixture: ComponentFixture<SelectInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInstructionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
