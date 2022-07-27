import { TestBed } from '@angular/core/testing';

import { ShopTokenResolver } from './shop-token.resolver';

describe('ShopTokenResolver', () => {
  let resolver: ShopTokenResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShopTokenResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
