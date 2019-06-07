import { TestBed } from '@angular/core/testing';

import { AuthadminService } from './authadmin.service';

describe('AuthadminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthadminService = TestBed.get(AuthadminService);
    expect(service).toBeTruthy();
  });
});
