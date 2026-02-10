import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Directory, FilesystemPlugin } from '@capacitor/filesystem';
import { AlertController, Platform } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import {
  BehaviorSubject,
  EMPTY,
  ReplaySubject,
  combineLatest,
  defer,
  iif,
  of,
} from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { FILESYSTEM_PLUGIN } from '../../../../shared/capacitor-plugins/capacitor-plugins.module';
import { ErrorService } from '../../../../shared/error/error.service';
import { calculateBase64Size } from '../../../../utils/memory';
import { MAX_ALLOWED_UPLOAD_SIZE_IN_BYTES } from '../custom-camera';

type CaptureMimeType = 'image/jpeg' | 'video/mp4';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const JPEG_QUALITY = 0.92;

@Component({
  selector: 'app-pre-publish-mode',
  templateUrl: './pre-publish-mode.component.html',
  styleUrls: ['./pre-publish-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrePublishModeComponent {
  private isBlackAndWhiteEnabled = false;

  readonly isBlackAndWhiteEnabled$ = new BehaviorSubject<boolean>(false);

  readonly curCaptureFileSize$ = new ReplaySubject<number>(1);

  readonly curCaptureFilePath$ = new ReplaySubject<string>(1);

  readonly curCaptureFileName$ = new ReplaySubject<string>(1);

  readonly curCaptureMimeType$ = new ReplaySubject<CaptureMimeType>(1);

  readonly curCaptureSrc$ = new ReplaySubject<string>(1);

  readonly isProcessingImage$ = new BehaviorSubject<boolean>(false);

  readonly isVideo$ = this.curCaptureMimeType$.pipe(
    map(mimeType => mimeType === 'video/mp4')
  );

  readonly isImage$ = this.curCaptureMimeType$.pipe(
    map(mimeType => mimeType === 'image/jpeg')
  );

  readonly curFileBase64Size$ = this.curCaptureFileSize$.pipe(
    map(fileSize => calculateBase64Size(fileSize))
  );

  readonly maxAllowedFileSize$ = defer(() =>
    of(MAX_ALLOWED_UPLOAD_SIZE_IN_BYTES)
  );

  readonly isFileSizeExceeded$ = combineLatest([
    this.curCaptureFileSize$,
    this.maxAllowedFileSize$,
  ]).pipe(map(([curSize, maxSize]) => curSize < maxSize));

  @Input()
  set curCaptureFileSize(value: number | undefined) {
    if (value) this.curCaptureFileSize$.next(value);
  }

  @Input()
  set curCaptureFilePath(value: string | undefined) {
    if (value) this.curCaptureFilePath$.next(value);
  }

  @Input()
  set curCaptureFileName(value: string | undefined) {
    if (value) this.curCaptureFileName$.next(value);
  }

  @Input()
  set curCaptureMimeType(value: CaptureMimeType | undefined) {
    if (value) this.curCaptureMimeType$.next(value);
  }

  @Input()
  set curCaptureSrc(value: string | undefined) {
    if (value) this.curCaptureSrc$.next(value);
  }

  @Output() discard: EventEmitter<any> = new EventEmitter();

  @Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(FILESYSTEM_PLUGIN)
    private readonly filesystemPlugin: FilesystemPlugin,
    private readonly errorService: ErrorService,
    private readonly alertController: AlertController,
    private readonly translocoService: TranslocoService,
    private readonly platform: Platform
  ) {}

  toggleBlackAndWhiteFilter() {
    this.isBlackAndWhiteEnabled = !this.isBlackAndWhiteEnabled;
    this.isBlackAndWhiteEnabled$.next(this.isBlackAndWhiteEnabled);
  }

  onDiscard() {
    this.discard.emit(true);
  }

  async onConfirm() {
    const runConfirmAction$ = this.isImage$.pipe(
      first(),
      tap(isImage => (isImage ? this.confirmImage() : this.confirmVideo()))
    );

    const showIsFileSizeExceededAction$ = defer(() =>
      this.showIsFileSizeExceededModal()
    );

    this.isFileSizeExceeded$
      .pipe(
        first(),
        switchMap(hasEnoughMemory =>
          iif(
            () => hasEnoughMemory,
            runConfirmAction$,
            showIsFileSizeExceededAction$
          )
        ),
        catchError((error: unknown) => this.errorService.toastError$(error))
      )
      .subscribe();
  }

  private async confirmImage() {
    if (!this.isBlackAndWhiteEnabled) {
      // No processing needed, just confirm
      this.confirm.emit(true);
      return;
    }

    this.isProcessingImage$.next(true);

    try {
      // Read the image from file
      const path = await this.getFilePath();
      const result = await this.filesystemPlugin.readFile({ path });
      const base64WithPrefix = `data:image/jpeg;base64,${result.data}`;

      // Apply black & white filter using Canvas
      const processedBase64 = await this.applyBlackAndWhiteToBase64(
        base64WithPrefix
      );
      await this.saveProcessedImage(processedBase64);
    } catch (error) {
      this.isProcessingImage$.next(false);
      this.errorService.toastError$(error).subscribe();
    }
  }

  private async getFilePath(): Promise<string> {
    return new Promise(resolve => {
      this.curCaptureFilePath$.pipe(first()).subscribe(path => resolve(path));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async applyBlackAndWhiteToBase64(
    base64Data: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          // Draw the original image
          ctx.drawImage(img, 0, 0);

          // Get image data and apply grayscale manually
          // (ctx.filter is not fully supported on iOS Safari)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Convert to grayscale using Rec. 601 luminance formula
          /* eslint-disable @typescript-eslint/no-magic-numbers */
          for (let i = 0; i < data.length; i += 4) {
            const gray =
              data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray; // Red
            data[i + 1] = gray; // Green
            data[i + 2] = gray; // Blue
            // Alpha (data[i + 3]) remains unchanged
          }
          /* eslint-enable @typescript-eslint/no-magic-numbers */

          // Put the modified image data back
          ctx.putImageData(imageData, 0, 0);

          // Get base64 data
          const processedBase64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          resolve(processedBase64);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64Data;
    });
  }

  private async saveProcessedImage(base64: string): Promise<void> {
    combineLatest([
      this.curCaptureFilePath$,
      of(base64),
      this.isImage$,
      this.curCaptureFileName$,
    ])
      .pipe(
        first(),
        switchMap(([path, data, isImage, fileName]) => {
          // Android: Use Cache directory because copyResultIfNeeded already moved
          // the file there (Android 13 workaround requires directory parameter)
          if (this.platform.is('android') && isImage) {
            return this.filesystemPlugin.writeFile({
              path: fileName,
              data: data,
              directory: Directory.Cache,
            });
          }
          // iOS and web: Write to original path so upload uses correct file
          return this.filesystemPlugin.writeFile({ path, data });
        }),
        tap(() => this.isProcessingImage$.next(false)),
        tap(() => this.confirm.emit(true)),
        catchError((error: unknown) => {
          this.isProcessingImage$.next(false);
          return this.errorService.toastError$(error);
        })
      )
      .subscribe();
  }

  private confirmVideo() {
    /**
     * Since there is no pre-processing required for videos,
     * we directly emit a true event to confirm the video.
     */
    this.confirm.emit(true);
  }

  private showIsFileSizeExceededModal() {
    const translations$ = this.translocoService.selectTranslateObject({
      'customCamera.error.fileSizeExeedsLimit': null,
      ok: null,
    });

    translations$
      .pipe(
        first(),
        switchMap(translations => {
          const [fileSizeExeedsLimit, okButtonText] = translations;

          return this.alertController.create({
            message: fileSizeExeedsLimit,
            buttons: [{ text: okButtonText }],
          });
        }),
        tap(alertElement => alertElement.present())
      )
      .subscribe();
    return EMPTY;
  }
}
