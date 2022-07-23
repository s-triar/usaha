import { TestBed } from '@angular/core/testing';

import { AuthViewStateService } from './auth-view-state.service';

describe('AuthViewStateService', () => {
  let service: AuthViewStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthViewStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
