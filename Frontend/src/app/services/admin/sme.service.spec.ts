import { TestBed } from '@angular/core/testing';

import { SmeService } from './sme.service';

describe('SmeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmeService = TestBed.get(SmeService);
    expect(service).toBeTruthy();
  });
});
