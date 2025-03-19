import { TestBed } from '@angular/core/testing';

import { EventRepsService } from './event-reps.service';

describe('EventRepsService', () => {
  let service: EventRepsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRepsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
