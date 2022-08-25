import { TestBed } from '@angular/core/testing';

import { ShopStateService } from './shop-state.service';

describe('ShopStateService', () => {
  let service: ShopStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
