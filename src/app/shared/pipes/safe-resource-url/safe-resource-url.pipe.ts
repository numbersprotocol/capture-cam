import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BUBBLE_IFRAME_URL } from '../../dia-backend/secret';

@Pipe({
  name: 'safeResourceUrl',
  standalone: false,
})
export class SafeResourceUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(url: string | null): SafeResourceUrl {
    if (!url?.startsWith(BUBBLE_IFRAME_URL)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
