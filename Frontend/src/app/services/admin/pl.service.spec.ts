import { TestBed } from '@angular/core/testing';

import { PlService } from './pl.service';

describe('PlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlService = TestBed.get(PlService);
    expect(service).toBeTruthy();
  });
});
