import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { JoyrideModule } from 'ngx-joyride';
import { SharedModule } from '../../../shared/shared.module';
import { CaptureDetailsWithIframeComponent } from './capture-details-with-iframe/capture-details-with-iframe.component';
import { CaptureDetailsWithIonicComponent } from './capture-details-with-ionic/capture-details-with-ionic.component';
import { DetailsPageRoutingModule } from './details-routing.module';
import { DetailsUploadingBarComponent } from './details-uploading-bar/details-uploading-bar.component';
import { DetailsPage } from './details.page';

@NgModule({
  imports: [SharedModule, DetailsPageRoutingModule, JoyrideModule.forChild()],
  providers: [DatePipe],
  declarations: [
    DetailsPage,
    CaptureDetailsWithIframeComponent,
    CaptureDetailsWithIonicComponent,
    DetailsUploadingBarComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsPageModule {}
