import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaptureAppWebCryptoApiSignatureProvider } from '../../shared/collector/signature/capture-app-web-crypto-api-signature-provider/capture-app-web-crypto-api-signature-provider.service';
import { DiaBackendAuthService } from '../../shared/dia-backend/auth/dia-backend-auth.service';
import { SharedTestingModule } from '../../shared/shared-testing.module';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  const diaBackendAuthServiceStub = {
    email$: of('tester@example.com'),
    emailVerified$: of(false),
    syncUser$: jasmine.createSpy().and.returnValue(of(void 0)),
  };

  const signatureProviderStub = {
    privateKey$: of('private-key-for-test'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [SharedTestingModule],
      providers: [
        {
          provide: DiaBackendAuthService,
          useValue: diaBackendAuthServiceStub,
        },
        {
          provide: CaptureAppWebCryptoApiSignatureProvider,
          useValue: signatureProviderStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
