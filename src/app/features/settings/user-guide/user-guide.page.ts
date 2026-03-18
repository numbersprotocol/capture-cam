import { Component } from '@angular/core';
import { ToggleCustomEvent } from '@ionic/angular';
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

  setHasHighlightedCameraTab(event: ToggleCustomEvent) {
    this.userGuideService.setHasHighlightedCameraTab(event.detail.checked);
  }

  setHasOpenedCustomCameraPage(event: ToggleCustomEvent) {
    this.userGuideService.setHasOpenedCustomCameraPage(event.detail.checked);
  }

  setHasCapturedPhotoWithCustomCamera(event: ToggleCustomEvent) {
    this.userGuideService.setHasCapturedPhotoWithCustomCamera(
      event.detail.checked
    );
  }

  setHasCapturedVideoWithCustomCamera(event: ToggleCustomEvent) {
    this.userGuideService.setHasCapturedVideoWithCustomCamera(
      event.detail.checked
    );
  }

  setHasHighlightedFirstCapture(event: ToggleCustomEvent) {
    this.userGuideService.setHasHighlightedFirstCapture(event.detail.checked);
  }

  setHasOpenedDetailsPage(event: ToggleCustomEvent) {
    this.userGuideService.setHasOpenedDetailsPage(event.detail.checked);
  }

  setHasClickedDetailsPageOptionsMenu(event: ToggleCustomEvent) {
    this.userGuideService.setHasClickedDetailsPageOptionsMenu(
      event.detail.checked
    );
  }

  setHasHighligtedActivityButton(event: ToggleCustomEvent) {
    this.userGuideService.setHasHighligtedActivityButton(event.detail.checked);
  }

  setHasOpenedActivitiesPage(event: ToggleCustomEvent) {
    this.userGuideService.setHasOpenedActivitiesPage(event.detail.checked);
  }

  setHasHightlightedInboxTab(event: ToggleCustomEvent) {
    this.userGuideService.setHasHightlightedInboxTab(event.detail.checked);
  }

  setHasOpenedInboxTab(event: ToggleCustomEvent) {
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
