import { TestBed } from '@angular/core/testing';
import { InformationRepository } from './information-repository.service';

describe('InformationRepository', () => {
  let service: InformationRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
