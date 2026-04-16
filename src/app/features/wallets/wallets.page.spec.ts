import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, of } from 'rxjs';
import { CaptureAppWebCryptoApiSignatureProvider } from '../../shared/collector/signature/capture-app-web-crypto-api-signature-provider/capture-app-web-crypto-api-signature-provider.service';
import { DiaBackendAuthService } from '../../shared/dia-backend/auth/dia-backend-auth.service';
import { DiaBackendWalletService } from '../../shared/dia-backend/wallet/dia-backend-wallet.service';
import { SharedTestingModule } from '../../shared/shared-testing.module';
import { WalletsPage } from './wallets.page';

describe('WalletsPage', () => {
  let component: WalletsPage;
  let fixture: ComponentFixture<WalletsPage>;

  const diaBackendAuthServiceStub = {
    cachedQueryJWTToken$: of({ access: 'token', refresh: 'refresh' }),
  };

  const diaBackendWalletServiceStub = {
    assetWalletAddr$: of('asset-wallet-address'),
    networkConnected$: of(true),
    reloadWallet$: new BehaviorSubject(false),
  };

  const signatureProviderStub = {
    publicKey$: of('public-key'),
    privateKey$: of('private-key'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WalletsPage],
      imports: [IonicModule.forRoot(), SharedTestingModule],
      providers: [
        {
          provide: DiaBackendAuthService,
          useValue: diaBackendAuthServiceStub,
        },
        {
          provide: DiaBackendWalletService,
          useValue: diaBackendWalletServiceStub,
        },
        {
          provide: CaptureAppWebCryptoApiSignatureProvider,
          useValue: signatureProviderStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
