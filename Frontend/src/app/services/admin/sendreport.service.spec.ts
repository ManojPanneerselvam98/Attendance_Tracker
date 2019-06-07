import { TestBed } from '@angular/core/testing';

import { SendreportService } from './sendreport.service';

describe('SendreportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendreportService = TestBed.get(SendreportService);
    expect(service).toBeTruthy();
  });
});
