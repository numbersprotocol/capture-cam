import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { DiaBackendAuthService } from '../../../../shared/dia-backend/auth/dia-backend-auth.service';
import { IframeService } from '../../../../shared/iframe/iframe.service';
import { SharedTestingModule } from '../../../../shared/shared-testing.module';
import { CollectionTabComponent } from './collection-tab.component';

describe('CollectionTabComponent', () => {
  let component: CollectionTabComponent;
  let fixture: ComponentFixture<CollectionTabComponent>;

  const diaBackendAuthServiceStub = {
    cachedQueryJWTToken$: of({ access: 'token', refresh: 'refresh' }),
  };

  const iframeServiceStub = {
    collectionTabRefreshRequested$: new BehaviorSubject(undefined),
    collectionTabIframeNavigateBack$: of(void 0),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionTabComponent],
      imports: [SharedTestingModule],
      providers: [
        {
          provide: DiaBackendAuthService,
          useValue: diaBackendAuthServiceStub,
        },
        {
          provide: IframeService,
          useValue: iframeServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
