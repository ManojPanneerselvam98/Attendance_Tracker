import { TestBed } from '@angular/core/testing';

import { AuthuserService } from './authuser.service';

describe('AuthuserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthuserService = TestBed.get(AuthuserService);
    expect(service).toBeTruthy();
  });
});
