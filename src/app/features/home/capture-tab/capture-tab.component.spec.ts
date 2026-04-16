import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { DiaBackendAuthService } from '../../../shared/dia-backend/auth/dia-backend-auth.service';
import { DiaBackendTransactionRepository } from '../../../shared/dia-backend/transaction/dia-backend-transaction-repository.service';
import { SharedTestingModule } from '../../../shared/shared-testing.module';
import { CaptureTabComponent } from './capture-tab.component';
import { UploadingBarComponent } from './uploading-bar/uploading-bar.component';

describe('CaptureTabComponent', () => {
  let component: CaptureTabComponent;
  let fixture: ComponentFixture<CaptureTabComponent>;

  const diaBackendAuthServiceStub = {
    username$: of(''),
    email$: of(''),
    profileName$: of(''),
    profile$: of({
      description: '',
      profile_background_thumbnail: '',
    }),
    syncUser$: jasmine.createSpy().and.returnValue(of(void 0)),
  };

  const diaBackendTransactionRepositoryStub = {
    inbox$: of({ count: 0 }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureTabComponent, UploadingBarComponent],
      imports: [SharedTestingModule],
      providers: [
        {
          provide: DiaBackendAuthService,
          useValue: diaBackendAuthServiceStub,
        },
        {
          provide: DiaBackendTransactionRepository,
          useValue: diaBackendTransactionRepositoryStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaptureTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
