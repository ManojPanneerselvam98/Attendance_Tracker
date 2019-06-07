import { TestBed } from '@angular/core/testing';

import { LoginRedirectService } from './login-redirect.service';

describe('LoginRedirectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginRedirectService = TestBed.get(LoginRedirectService);
    expect(service).toBeTruthy();
  });
});
