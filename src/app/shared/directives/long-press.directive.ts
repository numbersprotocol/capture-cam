import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

const DEFAULT_DURATION = 500;

@Directive({
  selector: '[appLongPress]',
})
export class LongPressDirective {
  @Input() appLongPressDuration = DEFAULT_DURATION;
  @Output() appLongPress = new EventEmitter<void>();

  private timeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('pointerdown')
  onPointerDown(): void {
    this.timeout = setTimeout(() => {
      this.appLongPress.emit();
    }, this.appLongPressDuration);
  }

  @HostListener('pointerup')
  @HostListener('pointerleave')
  onPointerUp(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}
