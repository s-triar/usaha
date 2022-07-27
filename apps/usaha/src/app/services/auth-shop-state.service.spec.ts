import { TestBed } from '@angular/core/testing';

import { AuthShopStateService } from './auth-shop-state.service';

describe('AuthShopStateService', () => {
  let service: AuthShopStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthShopStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
