import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { DiaBackendAuthService } from '../../shared/dia-backend/auth/dia-backend-auth.service';
import { ShareService } from '../../shared/share/share.service';
import { SharedTestingModule } from '../../shared/shared-testing.module';
import { InvitationPage } from './invitation.page';

describe('InvitationPage', () => {
  let component: InvitationPage;
  let fixture: ComponentFixture<InvitationPage>;

  const diaBackendAuthServiceStub = {
    referralCode$: of(''),
    getReferralCode: jasmine.createSpy().and.resolveTo(''),
    syncUser$: jasmine.createSpy().and.returnValue(of(void 0)),
  };

  const shareServiceStub = {
    shareReferralCode: jasmine.createSpy(),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationPage],
      imports: [IonicModule.forRoot(), SharedTestingModule],
      providers: [
        {
          provide: DiaBackendAuthService,
          useValue: diaBackendAuthServiceStub,
        },
        {
          provide: ShareService,
          useValue: shareServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
