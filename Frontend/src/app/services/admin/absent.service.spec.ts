import { TestBed } from '@angular/core/testing';

import { AbsentService } from './absent.service';

describe('AbsentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbsentService = TestBed.get(AbsentService);
    expect(service).toBeTruthy();
  });
});
