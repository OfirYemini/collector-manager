import { TestBed } from '@angular/core/testing';

import { TransactionsServiceService } from './transactions-service.service';

describe('TransactionsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionsServiceService = TestBed.get(TransactionsServiceService);
    expect(service).toBeTruthy();
  });
});
