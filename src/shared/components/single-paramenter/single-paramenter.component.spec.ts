import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleParamenterComponent } from './single-paramenter.component';

describe('SingleParamenterComponent', () => {
  let component: SingleParamenterComponent;
  let fixture: ComponentFixture<SingleParamenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleParamenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleParamenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
