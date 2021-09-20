import { TestBed } from '@angular/core/testing';

import { RestReviewService } from './rest-review.service';

describe('RestReviewService', () => {
  let service: RestReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
