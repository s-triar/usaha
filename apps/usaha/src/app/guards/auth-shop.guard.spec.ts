import { TestBed } from '@angular/core/testing';

import { AuthShopGuard } from './auth-shop.guard';

describe('AuthShopGuard', () => {
  let guard: AuthShopGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthShopGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
