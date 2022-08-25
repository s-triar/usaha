import { TestBed } from '@angular/core/testing';

import { PopUpConfirmationService } from './pop-up-confirmation.service';

describe('PopUpConfirmationService', () => {
  let service: PopUpConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
