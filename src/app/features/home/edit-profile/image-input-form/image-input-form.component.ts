import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-image-input-form',
  templateUrl: './image-input-form.component.html',
  styleUrls: ['./image-input-form.component.scss'],
  standalone: false,
})
export class ImageInputFormComponent {
  readonly placeholderText$ = new ReplaySubject<string>(1);

  readonly imagePreview$ = new ReplaySubject<string | ArrayBuffer | File>(1);

  selectedImage: File | undefined;

  @Input()
  set placeholderText(value: string | undefined) {
    if (value) this.placeholderText$.next(value);
  }

  @Input()
  set imagePreview(value: string | undefined | null) {
    if (value) this.imagePreview$.next(value);
  }

  @Output()
  imageSelected = new EventEmitter<File>();

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const image = file as File;
      this.selectedImage = image;
      this.prepareImagePreview(image);
      this.imageSelected.next(image);
    }
  }

  private prepareImagePreview(image: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) =>
      this.imagePreview$.next(e.target?.result ?? '');
    reader.readAsDataURL(image);
  }
}
