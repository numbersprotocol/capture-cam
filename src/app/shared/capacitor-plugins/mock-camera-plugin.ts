/* eslint-disable class-methods-use-this, @typescript-eslint/require-await */
import {
  Photo as CameraPhoto,
  CameraPlugin,
  CameraPluginPermissions,
  ChooseFromGalleryOptions,
  EditPhotoOptions,
  EditPhotoResult,
  EditURIPhotoOptions,
  GalleryImageOptions,
  GalleryPhotos,
  ImageOptions,
  MediaResult,
  MediaResults,
  PermissionStatus,
  PlayVideoOptions,
  RecordVideoOptions,
  TakePhotoOptions,
} from '@capacitor/camera';

export class MockCameraPlugin implements CameraPlugin {
  async pickImages(_: GalleryImageOptions): Promise<GalleryPhotos> {
    throw new Error('Method not implemented.');
  }
  async checkPermissions(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }
  async requestPermissions(
    _?: CameraPluginPermissions
  ): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }
  async getPhoto(_options: ImageOptions): Promise<CameraPhoto> {
    throw new Error('Method not implemented.');
  }

  async pickLimitedLibraryPhotos(): Promise<GalleryPhotos> {
    throw new Error('Method not implemented.');
  }

  async getLimitedLibraryPhotos(): Promise<GalleryPhotos> {
    throw new Error('Method not implemented.');
  }

  async takePhoto(_options: TakePhotoOptions): Promise<MediaResult> {
    throw new Error('Method not implemented.');
  }

  async recordVideo(_options: RecordVideoOptions): Promise<MediaResult> {
    throw new Error('Method not implemented.');
  }

  async playVideo(_options: PlayVideoOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async chooseFromGallery(
    _options: ChooseFromGalleryOptions
  ): Promise<MediaResults> {
    throw new Error('Method not implemented.');
  }

  async editPhoto(_options: EditPhotoOptions): Promise<EditPhotoResult> {
    throw new Error('Method not implemented.');
  }

  async editURIPhoto(_options: EditURIPhotoOptions): Promise<MediaResult> {
    throw new Error('Method not implemented.');
  }
}
