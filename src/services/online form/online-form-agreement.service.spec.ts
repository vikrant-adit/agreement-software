import { TestBed } from '@angular/core/testing';

import { OnlineFormAgreementService } from './online-form-agreement.service';

describe('OnlineFormAgreementService', () => {
  let service: OnlineFormAgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineFormAgreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
