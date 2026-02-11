import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { getFileType } from '../../../../../utils/url';
import { GoProFile } from '../go-pro-media-file';
import { GoProMediaService } from '../services/go-pro-media.service';
import { GoProWifiService } from '../services/go-pro-wifi.service';

@Component({
  selector: 'app-go-pro-media-item-detail-on-camera',
  templateUrl: './go-pro-media-item-detail-on-camera.component.html',
  styleUrls: ['./go-pro-media-item-detail-on-camera.component.scss'],
})
export class GoProMediaItemDetailOnCameraComponent implements OnInit {
  mediaFile: GoProFile | undefined;

  mediaType: 'unknown' | 'image' | 'video' = 'unknown';

  showTutorialForMobileDataOnlyApps = false;
  dontShowAgainTutorialForMobileDataOnlyApps = false;

  @ViewChild('swiper') swiperRef?: ElementRef;

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    public toastController: ToastController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public goProMediaService: GoProMediaService,
    public goProWiFiService: GoProWifiService
  ) {
    const state = history.state;
    if (state) {
      this.mediaFile = state.goProMediaFile;
    }
  }

  ngOnInit() {
    this.mediaType = getFileType(this.mediaFile?.url);
  }

  // eslint-disable-next-line class-methods-use-this
  playVideoFullScreen() {
    this.router.navigate(['/settings', 'go-pro', 'media-item-viewer'], {
      state: { goProMediaFile: this.mediaFile },
    });
  }

  async uploadToCapture() {
    const allowed = await this.allowUploadWithMobileInternet();
    if (allowed) {
      await this.startUploadToCapture();

      if (await this.goProWiFiService.showTutorialForMobileDataOnlyApps()) {
        this.showTutorialForMobileDataOnlyApps = true;
      }
    }
  }

  hideTutorialForMobileDataOnlyApps() {
    this.showTutorialForMobileDataOnlyApps = false;

    if (this.dontShowAgainTutorialForMobileDataOnlyApps == true) {
      this.goProWiFiService.dontShowAgainTutorialForMobileDataOnlyApps();
    }
  }

  private async startUploadToCapture() {
    const loading = await this.loadingController.create({
      message: 'Please wait... loading file',
    });
    await loading.present();
    try {
      await this.goProMediaService.uploadToCaptureFromGoProCamera(
        this.mediaFile
      );
      await loading.dismiss();
      await this.presentToast(`✅ Upload added to the queue, see Home Page`);
    } catch (error) {
      await loading.dismiss();
      await this.presentToast(`❌ Failed to upload`);
    }
  }

  async allowUploadWithMobileInternet() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<boolean>(async resolve => {
      const alert = await this.alertController.create({
        header: 'Warning!',
        message:
          'You are using mobile data to upload file! ' +
          '<strong>Do you want to continue?</strong>',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
          {
            text: 'Okay',
            handler: () => {
              resolve(true);
            },
          },
        ],
      });
      await alert.present();
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1700,
    });
    toast.present();
  }

  goBack() {
    this.location.back();
  }

  slideNext() {
    this.swiperRef?.nativeElement?.swiper?.slideNext();
  }
}
