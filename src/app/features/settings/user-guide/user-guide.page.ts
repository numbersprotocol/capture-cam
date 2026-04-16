import { Component } from '@angular/core';
import { CheckboxCustomEvent } from '@ionic/angular';
import { UserGuideService } from '../../../shared/user-guide/user-guide.service';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.page.html',
  styleUrls: ['./user-guide.page.scss'],
})
export class UserGuidePage {
  readonly hasHighlightedCameraTab$ =
    this.userGuideService.hasHighlightedCameraTab$();

  readonly hasOpenedCustomCameraPage$ =
    this.userGuideService.hasOpenedCustomCameraPage$();

  readonly hasCapturedPhotoWithCustomCamera$ =
    this.userGuideService.hasCapturedPhotoWithCustomCamera$();

  readonly hasCapturedVideoWithCustomCamera$ =
    this.userGuideService.hasCapturedVideoWithCustomCamera$();

  readonly hasHighlightedFirstCapture$ =
    this.userGuideService.hasHighlightedFirstCapture$();

  readonly hasOpenedDetailsPage$ =
    this.userGuideService.hasOpenedDetailsPage$();

  readonly hasClickedDetailsPageOptionsMenu$ =
    this.userGuideService.hasClickedDetailsPageOptionsMenu$();

  readonly hasHighligtedActivityButton$ =
    this.userGuideService.hasHighligtedActivityButton$();

  readonly hasOpenedActivitiesPage$ =
    this.userGuideService.hasOpenedActivitiesPage$();

  readonly hasHightlightedInboxTab$ =
    this.userGuideService.hasHightlightedInboxTab$();

  readonly hasOpenedInboxTab$ = this.userGuideService.hasOpenedInboxTab$();

  constructor(private readonly userGuideService: UserGuideService) {}

  setHasHighlightedCameraTab(event: CheckboxCustomEvent) {
    this.userGuideService.setHasHighlightedCameraTab(event.detail.checked);
  }

  setHasOpenedCustomCameraPage(event: CheckboxCustomEvent) {
    this.userGuideService.setHasOpenedCustomCameraPage(event.detail.checked);
  }

  setHasCapturedPhotoWithCustomCamera(event: CheckboxCustomEvent) {
    this.userGuideService.setHasCapturedPhotoWithCustomCamera(
      event.detail.checked
    );
  }

  setHasCapturedVideoWithCustomCamera(event: CheckboxCustomEvent) {
    this.userGuideService.setHasCapturedVideoWithCustomCamera(
      event.detail.checked
    );
  }

  setHasHighlightedFirstCapture(event: CheckboxCustomEvent) {
    this.userGuideService.setHasHighlightedFirstCapture(event.detail.checked);
  }

  setHasOpenedDetailsPage(event: CheckboxCustomEvent) {
    this.userGuideService.setHasOpenedDetailsPage(event.detail.checked);
  }

  setHasClickedDetailsPageOptionsMenu(event: CheckboxCustomEvent) {
    this.userGuideService.setHasClickedDetailsPageOptionsMenu(
      event.detail.checked
    );
  }

  setHasHighligtedActivityButton(event: CheckboxCustomEvent) {
    this.userGuideService.setHasHighligtedActivityButton(event.detail.checked);
  }

  setHasOpenedActivitiesPage(event: CheckboxCustomEvent) {
    this.userGuideService.setHasOpenedActivitiesPage(event.detail.checked);
  }

  setHasHightlightedInboxTab(event: CheckboxCustomEvent) {
    this.userGuideService.setHasHightlightedInboxTab(event.detail.checked);
  }

  setHasOpenedInboxTab(event: CheckboxCustomEvent) {
    this.userGuideService.setHasOpenedInboxTab(event.detail.checked);
  }

  resetAll() {
    this.userGuideService.setHasHighlightedCameraTab(false);
    this.userGuideService.setHasOpenedCustomCameraPage(false);
    this.userGuideService.setHasOpenedCustomCameraPage(false);
    this.userGuideService.setHasCapturedPhotoWithCustomCamera(false);
    this.userGuideService.setHasCapturedVideoWithCustomCamera(false);
    this.userGuideService.setHasHighlightedFirstCapture(false);
    this.userGuideService.setHasOpenedDetailsPage(false);
    this.userGuideService.setHasClickedDetailsPageOptionsMenu(false);
    this.userGuideService.setHasHighligtedActivityButton(false);
    this.userGuideService.setHasOpenedActivitiesPage(false);
    this.userGuideService.setHasHightlightedInboxTab(false);
    this.userGuideService.setHasOpenedInboxTab(false);
  }
}
