import { TestBed } from '@angular/core/testing';

import { AuthShopInterceptor } from './auth-shop.interceptor';

describe('AuthShopInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthShopInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthShopInterceptor = TestBed.inject(AuthShopInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
