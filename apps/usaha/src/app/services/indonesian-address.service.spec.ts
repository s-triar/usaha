import { TestBed } from '@angular/core/testing';

import { IndonesianAddressService } from './indonesian-address.service';

describe('IndonesianAddressService', () => {
  let service: IndonesianAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndonesianAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
