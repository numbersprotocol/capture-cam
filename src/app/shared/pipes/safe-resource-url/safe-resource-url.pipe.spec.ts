import { DomSanitizer } from '@angular/platform-browser';
import { BUBBLE_IFRAME_URL } from '../../dia-backend/secret';
import { SafeResourceUrlPipe } from './safe-resource-url.pipe';

describe('SafeResourceUrlPipe', () => {
  let domSanitizerMock: DomSanitizer | null = null;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    domSanitizerMock = {
      sanitize(_, __) {
        return null;
      },
      bypassSecurityTrustHtml: (value: any) => value.toString(),
      bypassSecurityTrustStyle: (value: any) => value.toString(),
      bypassSecurityTrustScript: (value: any) => value.toString(),
      bypassSecurityTrustUrl: (value: any) => value.toString(),
      bypassSecurityTrustResourceUrl: (value: any) => value.toString(),
    };
  });

  it('create an instance', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pipe = new SafeResourceUrlPipe(domSanitizerMock!);
    expect(pipe).toBeTruthy();
  });

  it('should bypass security for a trusted URL prefixed with BUBBLE_IFRAME_URL', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pipe = new SafeResourceUrlPipe(domSanitizerMock!);
    const trustedUrl = `${BUBBLE_IFRAME_URL}/wallet`;
    expect(pipe.transform(trustedUrl)).toBe(trustedUrl);
  });

  it('should block an untrusted URL and return an empty safe resource URL', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pipe = new SafeResourceUrlPipe(domSanitizerMock!);
    expect(pipe.transform('javascript:alert(1)')).toBe('');
  });

  it('should block an empty URL and return an empty safe resource URL', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pipe = new SafeResourceUrlPipe(domSanitizerMock!);
    expect(pipe.transform('')).toBe('');
  });

  it('should block a null URL and return an empty safe resource URL', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pipe = new SafeResourceUrlPipe(domSanitizerMock!);
    expect(pipe.transform(null)).toBe('');
  });
});
