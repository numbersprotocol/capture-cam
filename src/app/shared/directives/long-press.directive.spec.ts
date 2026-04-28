import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LongPressDirective } from './long-press.directive';

@Component({
  template: `<button
    appLongPress
    [appLongPressDuration]="duration"
    (appLongPress)="onLongPress()"
  ></button>`,
  standalone: false,
})
class TestComponent {
  duration = 500;
  longPressTriggered = false;
  onLongPress() {
    this.longPressTriggered = true;
  }
}

describe('LongPressDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let button: HTMLButtonElement;

  function detectChanges(): void {
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LongPressDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit appLongPress after holding for duration', fakeAsync(() => {
    detectChanges();
    button.dispatchEvent(new PointerEvent('pointerdown'));
    expect(component.longPressTriggered).toBeFalse();

    tick(500);
    expect(component.longPressTriggered).toBeTrue();
  }));

  it('should not emit if released before duration', fakeAsync(() => {
    detectChanges();
    button.dispatchEvent(new PointerEvent('pointerdown'));
    tick(200);
    button.dispatchEvent(new PointerEvent('pointerup'));
    tick(300);

    expect(component.longPressTriggered).toBeFalse();
  }));

  it('should not emit if pointer leaves before duration', fakeAsync(() => {
    detectChanges();
    button.dispatchEvent(new PointerEvent('pointerdown'));
    tick(200);
    button.dispatchEvent(new PointerEvent('pointerleave'));
    tick(300);

    expect(component.longPressTriggered).toBeFalse();
  }));

  it('should respect custom duration', fakeAsync(() => {
    component.duration = 1000;
    detectChanges();

    button.dispatchEvent(new PointerEvent('pointerdown'));
    tick(500);
    expect(component.longPressTriggered).toBeFalse();

    tick(500);
    expect(component.longPressTriggered).toBeTrue();
  }));
});
