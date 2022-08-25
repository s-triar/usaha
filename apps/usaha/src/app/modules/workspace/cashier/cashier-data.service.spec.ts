import { TestBed } from '@angular/core/testing';

import { CashierDataService } from './cashier-data.service';

describe('CashierDataService', () => {
  let service: CashierDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashierDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
