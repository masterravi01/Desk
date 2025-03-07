import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewParameterComponent } from './new-parameter.component';

describe('NewParameterComponent', () => {
  let component: NewParameterComponent;
  let fixture: ComponentFixture<NewParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewParameterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
