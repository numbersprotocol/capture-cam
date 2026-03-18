import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BUBBLE_IFRAME_URL } from '../../dia-backend/secret';

@Pipe({
  name: 'safeResourceUrl',
})
export class SafeResourceUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url || !url.startsWith(BUBBLE_IFRAME_URL)) {
      console.warn('Untrusted URL blocked:', url);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
