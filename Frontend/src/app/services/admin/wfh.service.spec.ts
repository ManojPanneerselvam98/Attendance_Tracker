import { TestBed } from '@angular/core/testing';

import { WfhService } from './wfh.service';

describe('WfhService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WfhService = TestBed.get(WfhService);
    expect(service).toBeTruthy();
  });
});
