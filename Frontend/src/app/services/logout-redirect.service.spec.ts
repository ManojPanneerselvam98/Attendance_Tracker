import { TestBed } from '@angular/core/testing';

import { LogoutRedirectService } from './logout-redirect.service';

describe('LogoutRedirectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogoutRedirectService = TestBed.get(LogoutRedirectService);
    expect(service).toBeTruthy();
  });
});
