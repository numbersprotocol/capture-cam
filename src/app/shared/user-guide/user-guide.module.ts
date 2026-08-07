import { NgModule } from '@angular/core';
import { provideUiTour, TourIonPopover } from 'ngx-ui-tour-ionic';

@NgModule({
  imports: [...TourIonPopover],
  exports: [...TourIonPopover],
})
export class UserGuideModule {}

export function provideUserGuideTour() {
  return provideUiTour({
    duplicateAnchorHandling: 'registerFirst',
    popoverClass: 'capture-tour-popover',
  });
}
