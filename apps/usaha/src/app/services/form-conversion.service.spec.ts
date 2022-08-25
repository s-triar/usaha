import { TestBed } from '@angular/core/testing';

import { FormConversionService } from './form-conversion.service';

describe('FormConversionService', () => {
  let service: FormConversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormConversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
