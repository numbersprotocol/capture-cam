import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { EMPTY, of } from 'rxjs';
import { ErrorService } from '../../../../../shared/error/error.service';
import { SharedTestingModule } from '../../../../../shared/shared-testing.module';
import { ActionDetailsPage } from './action-details.page';

describe('ActionDetailsPage', () => {
  let component: ActionDetailsPage;
  let fixture: ComponentFixture<ActionDetailsPage>;
  let errorService: ErrorService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDetailsPage],
      imports: [SharedTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'test-cid' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionDetailsPage);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('redirectToExternalUrl', () => {
    let browserOpenSpy: jasmine.Spy;
    let toastErrorSpy: jasmine.Spy;

    beforeEach(() => {
      browserOpenSpy = spyOn(Browser, 'open').and.resolveTo();
      toastErrorSpy = spyOn(errorService, 'toastError$').and.returnValue(EMPTY);
    });

    it('should open valid HTTPS URL from allowlisted domain captureapp.xyz', fakeAsync(() => {
      component.redirectToExternalUrl(
        'https://app.captureapp.xyz/action',
        'order-1'
      );
      tick();
      expect(browserOpenSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          url: jasmine.stringContaining('https://app.captureapp.xyz/action'),
        })
      );
      expect(toastErrorSpy).not.toHaveBeenCalled();
    }));

    it('should open valid HTTPS URL from allowlisted domain numbersprotocol.io', fakeAsync(() => {
      component.redirectToExternalUrl(
        'https://numbersprotocol.io/action',
        'order-2'
      );
      tick();
      expect(browserOpenSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          url: jasmine.stringContaining('https://numbersprotocol.io/action'),
        })
      );
      expect(toastErrorSpy).not.toHaveBeenCalled();
    }));

    it('should open valid HTTPS URL from legitimate subdomain of allowlisted domain', fakeAsync(() => {
      component.redirectToExternalUrl(
        'https://subdomain.captureapp.xyz/action',
        'order-7'
      );
      tick();
      expect(browserOpenSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          url: jasmine.stringContaining(
            'https://subdomain.captureapp.xyz/action'
          ),
        })
      );
      expect(toastErrorSpy).not.toHaveBeenCalled();
    }));

    it('should reject HTTP URLs', () => {
      component.redirectToExternalUrl(
        'http://captureapp.xyz/action',
        'order-3'
      );
      expect(browserOpenSpy).not.toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });

    it('should reject URLs from non-allowlisted domains', () => {
      component.redirectToExternalUrl('https://evil.example.com', 'order-4');
      expect(browserOpenSpy).not.toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });

    it('should reject URLs that try to spoof allowlisted domains via subdomain confusion', () => {
      component.redirectToExternalUrl(
        'https://captureapp.xyz.evil.com',
        'order-5'
      );
      expect(browserOpenSpy).not.toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });

    it('should reject URLs that try to spoof allowlisted domains via similar domain names', () => {
      component.redirectToExternalUrl('https://evil-captureapp.xyz', 'order-8');
      expect(browserOpenSpy).not.toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });

    it('should reject invalid URLs', () => {
      component.redirectToExternalUrl('not-a-url', 'order-6');
      expect(browserOpenSpy).not.toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });
});
