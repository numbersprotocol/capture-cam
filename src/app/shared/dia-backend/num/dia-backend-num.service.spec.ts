import { TestBed } from '@angular/core/testing';
import { SharedTestingModule } from '../../shared-testing.module';

import { DiaBackendNumService } from './dia-backend-num.service';

describe('DiaBackendNumService', () => {
  let service: DiaBackendNumService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SharedTestingModule] });
    service = TestBed.inject(DiaBackendNumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
