import { TestBed } from '@angular/core/testing';

import { ProductInService } from './product-in.service';

describe('ProductInService', () => {
  let service: ProductInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
