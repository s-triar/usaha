import { TestBed } from '@angular/core/testing';

import { ProductUpdateInfoResolver } from './product-update-info.resolver';

describe('ProductUpdateInfoResolver', () => {
  let resolver: ProductUpdateInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProductUpdateInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
