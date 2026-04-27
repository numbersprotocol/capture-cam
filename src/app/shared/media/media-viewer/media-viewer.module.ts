import { NgModule } from '@angular/core';
import { PinchZoomComponent } from '@meddv/ngx-pinch-zoom';
import { SharedModule } from '../../shared.module';
import { MediaViewerPageRoutingModule } from './media-viewer-routing.module';
import { MediaViewerPage } from './media-viewer.page';

@NgModule({
  imports: [SharedModule, MediaViewerPageRoutingModule, PinchZoomComponent],
  declarations: [MediaViewerPage],
})
export class MediaViewerPageModule {}
