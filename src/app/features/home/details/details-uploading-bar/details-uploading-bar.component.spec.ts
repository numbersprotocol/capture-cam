import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedTestingModule } from '../../../../shared/shared-testing.module';
import { DetailsUploadingBarComponent } from './details-uploading-bar.component';

describe('DetailsUploadingBarComponent', () => {
  let component: DetailsUploadingBarComponent;
  let fixture: ComponentFixture<DetailsUploadingBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsUploadingBarComponent],
      imports: [SharedTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsUploadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
