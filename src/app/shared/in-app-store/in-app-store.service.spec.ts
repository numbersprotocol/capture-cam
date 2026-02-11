import { TestBed } from '@angular/core/testing';
import { SharedTestingModule } from '../shared-testing.module';

import { InAppStoreService } from './in-app-store.service';

describe('InAppStoreService', () => {
  let service: InAppStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(InAppStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
