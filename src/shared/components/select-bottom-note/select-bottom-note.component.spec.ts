import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBottomNoteComponent } from './select-bottom-note.component';

describe('SelectBottomNoteComponent', () => {
  let component: SelectBottomNoteComponent;
  let fixture: ComponentFixture<SelectBottomNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBottomNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectBottomNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
