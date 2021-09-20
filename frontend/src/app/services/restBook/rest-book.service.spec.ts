import { TestBed } from '@angular/core/testing';

import { RestBookService } from './rest-book.service';

describe('RestBookService', () => {
  let service: RestBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
