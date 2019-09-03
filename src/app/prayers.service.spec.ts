import { TestBed } from '@angular/core/testing';

import { PrayersService } from './prayers.service';

describe('PrayersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrayersService = TestBed.get(PrayersService);
    expect(service).toBeTruthy();
  });
});
