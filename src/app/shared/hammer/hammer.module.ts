import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgModule } from '@angular/core';
import {
  EVENT_MANAGER_PLUGINS,
  EventManagerPlugin,
} from '@angular/platform-browser';

const HAMMER_EVENTS = new Set([
  'doubletap',
  'pan',
  'pancancel',
  'panend',
  'panleft',
  'panmove',
  'panright',
  'panstart',
  'panup',
  'pandown',
  'pinch',
  'pinchcancel',
  'pinchend',
  'pinchin',
  'pinchmove',
  'pinchout',
  'pinchstart',
  'press',
  'pressup',
  'rotate',
  'rotatecancel',
  'rotateend',
  'rotatemove',
  'rotatestart',
  'swipe',
  'swipedown',
  'swipeleft',
  'swiperight',
  'swipeup',
  'tap',
]);

@Injectable()
export class HammerGesturesPlugin extends EventManagerPlugin {
  constructor(@Inject(DOCUMENT) document: Document) {
    super(document);
  }

  // EventManagerPlugin requires this method to be an instance member.
  // eslint-disable-next-line class-methods-use-this
  supports(eventName: string): boolean {
    return (
      HAMMER_EVENTS.has(eventName.toLowerCase()) &&
      typeof Hammer !== 'undefined'
    );
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: (event: HammerInput) => void
  ): () => void {
    const zone = this.manager.getZone();

    return zone.runOutsideAngular(() => {
      const manager = new Hammer(element);
      manager.get('pinch').set({ enable: true });
      manager.get('rotate').set({ enable: true });

      const callback = (event: HammerInput) => {
        zone.runGuarded(() => handler(event));
      };

      manager.on(eventName.toLowerCase(), callback);

      return () => {
        manager.off(eventName.toLowerCase(), callback);
        manager.destroy();
      };
    });
  }
}

@NgModule({
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: HammerGesturesPlugin,
      multi: true,
    },
  ],
})
export class HammerModule {}
