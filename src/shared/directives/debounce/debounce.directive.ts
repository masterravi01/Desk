import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounce]',
})
export class DebounceDirective {
  @Output() debouncedEvent = new EventEmitter<string>();
  private debounceSubject = new Subject<string>();

  constructor(private el: ElementRef) {
    this.debounceSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.debouncedEvent.emit(value);
    });
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.debounceSubject.next(value);
  }
}
