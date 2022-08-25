import { TestBed } from '@angular/core/testing';

import { PopUpNotifService } from './pop-up-notif.service';

describe('PopUpNotifService', () => {
  let service: PopUpNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
