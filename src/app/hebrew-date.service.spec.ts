import { TestBed } from '@angular/core/testing';

import { HebrewDateService } from './hebrew-date.service';

describe('HebrewDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HebrewDateService = TestBed.get(HebrewDateService);
    expect(service).toBeTruthy();
  });
});
