import { TestBed } from '@angular/core/testing';

import { PlannedleaveService } from './plannedleave.service';

describe('PlannedleaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlannedleaveService = TestBed.get(PlannedleaveService);
    expect(service).toBeTruthy();
  });
});
